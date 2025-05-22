import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { useEffect } from 'react';

const QlEditor = ({ setContent, valueContent }) => {

    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': [] }],  // Font and size dropdowns
            ['bold', 'italic', 'underline', 'strike'],  // Text formatting
            [{ 'color': [] }, { 'background': [] }],  // Text color and background color
            [{ 'script': 'sub' }, { 'script': 'super' }],  // Subscript and superscript
            [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],  // Headers, blockquote, code block
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],  // Lists and indentation
            [{ 'align': [] }],  // Alignment options
            ['link', 'image', 'video'],  // Link, image, video
            ['clean']  // Remove formatting button
        ]
    };

    const formats = [
        'font', 'size', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'script', 'header', 'blockquote', 'code-block',
        'list', 'bullet', 'indent', 'align', 'link', 'image', 'video'
    ];

    const { quill, quillRef } = useQuill({ modules, formats });

    useEffect(() => {
        if (quill) {
            // Set the content as the user types
            quill.on('text-change', (delta, oldDelta, source) => {
                setContent(quillRef.current.firstChild.innerHTML);
            });

            // Set initial value when 'value' prop changes
            if (valueContent) {
                quill.clipboard.dangerouslyPasteHTML(valueContent);
            }
        }
    }, [quill]);

    return (
        <>
            <div ref={quillRef} />
        </>
    )
}

export default QlEditor