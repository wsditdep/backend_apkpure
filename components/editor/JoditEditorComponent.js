// components/JoditEditorComponent.js
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import JoditEditor with no SSR
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

const JoditEditorComponent = ({ value, onChange }) => {
  const [editorLoaded, setEditorLoaded] = useState(false); // Add useState here

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  return (
    <div>
      {editorLoaded ? (
        <JoditEditor
          value={value}
          config={{
            readonly: false, // All options from https://xdsoft.net/jodit/doc/
          }}
          tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={(newContent) => {}}
        />
      ) : (
        <div>Loading editor...</div>
      )}
    </div>
  );
};

export default JoditEditorComponent;
