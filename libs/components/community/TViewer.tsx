import React, { useEffect, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Box, Stack, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import type { ViewerProps } from '@toast-ui/react-editor';

const Viewer = dynamic<ViewerProps>(
  () =>
    import('@toast-ui/react-editor').then((mod) => mod.Viewer as React.ComponentType<ViewerProps>),
  {
    ssr: false,
    loading: () => <CircularProgress />,
  }
);


const isHTML = (content: string): boolean => {
  const pattern = /<\/?[a-z][\s\S]*>/i;
  return pattern.test(content);
};

const TViewer = ({ markdown }: { markdown: string }) => {
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    setEditorLoaded(!!markdown);
  }, [markdown]);

  return (
    <Stack sx={{ background: 'white', mt: '30px', borderRadius: '10px' }}>
      <Box component="div" sx={{ m: '40px' }}>
        {editorLoaded ? (
          isHTML(markdown) ? (
            <Box
              sx={{
                fontFamily: 'inherit',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333',
              }}
              dangerouslySetInnerHTML={{ __html: markdown }}
            />
          ) : (
            <Viewer
              initialValue={markdown}
              usageStatistics={false}
              customHTMLRenderer={{
                htmlBlock: {
                  iframe(node: any) {
                    return [
                      {
                        type: 'openTag',
                        tagName: 'iframe',
                        outerNewLine: true,
                        attributes: node.attrs,
                      },
                      { type: 'html', content: node.childrenHTML ?? '' },
                      { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
                    ];
                  },
                  div(node: any) {
                    return [
                      { type: 'openTag', tagName: 'div', outerNewLine: true, attributes: node.attrs },
                      { type: 'html', content: node.childrenHTML ?? '' },
                      { type: 'closeTag', tagName: 'div', outerNewLine: true },
                    ];
                  },
                },
                htmlInline: {
                  big(node: any, { entering }: any) {
                    return entering
                      ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
                      : { type: 'closeTag', tagName: 'big' };
                  },
                },
              }}
            />
          )
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Stack>
  );
};

export default TViewer;
