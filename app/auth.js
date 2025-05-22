import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/utils/connection";
import { User } from "@/modals/User";
import axios from "axios";
import { headers } from 'next/headers'
import { SystemLogHistory } from "@/modals/SystemLogHistory";
import { UAParser } from 'ua-parser-js';

const login = async (credentials) => {
    try {
        await connectToDB();
        const user = await User.findOne({
            $and: [
                { agent_username: credentials.username },
                { role: { $nin: ["user", "practice", "agent"] } }
            ]
        });

        if (!user?.isAuth) {
            return null
        }

        if (!user) {
            return null
        }

        if (!user?.status) {
            return null
        }

        if (user.role === "user" || user.role === "practice" || user.role === "agent") {
            return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
        );

        if (!isPasswordCorrect) {
            return null
        }

        const headersList = headers();
        const xRealIp = headersList.get('x-real-ip');

        var deviceIP = xRealIp || "Unknown";

        const res = await axios.get(`http://ip-api.com/json/${deviceIP}`);
        const data = res.data;

        const userAgentString = headersList.get('user-agent') || '';
        const parser = new UAParser(userAgentString);
        const uaResult = parser.getResult();

        const domain = headersList.get('host') || 'Unknown';

        if (res.status === 200) {

            await SystemLogHistory.create({
                username: user.username,
                phone_number: user.phone_number,
                ip_address: deviceIP,
                country_name: data.country,
                region_name: data.regionName,
                city_name: data.city,
                device_type: uaResult.device.type || 'desktop',
                os: uaResult.os.name + ' ' + uaResult.os.version,
                browser: uaResult.browser.name + ' ' + uaResult.browser.version,
                user_agent: userAgentString,
                device_id_old: user?.deviceID ?? "NULL",
                device_id_new: credentials?.did ?? "NULL",
                domain: domain,
            });

            const currentDateTime = new Date();

            if (user?.deviceID !== credentials?.did) {
                await User.findByIdAndUpdate(user?._id, {
                    last_login: currentDateTime,
                    deviceID: credentials?.did
                });
            } else {
                await User.findByIdAndUpdate(user?._id, {
                    last_login: currentDateTime
                });
            }
        }

        return user;
    } catch (err) {
        console.log(err);
    }
};

export const { signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    const user = await login(credentials);
                    return user;
                } catch (err) {
                    return null;
                }
            },
        }),
    ],
    // ADD ADDITIONAL INFORMATION TO SESSION
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user)
            return token
        },
        session: async ({ session, token }) => {
            const user = token.user
            session.user = user
            return session
        }
    }
});