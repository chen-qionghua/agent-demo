/* eslint-disable @next/next/no-sync-scripts */
import Document, { Head, Html, Main, NextScript } from 'next/document'

const hideCommonJsGlobals = `
  window.__umdModule = window.module;
  window.__umdExports = window.exports;
  window.__umdDefine = window.define;
  try {
    delete window.module;
    delete window.exports;
    delete window.define;
  } catch (error) {
    window.module = undefined;
    window.exports = undefined;
    window.define = undefined;
  }
`

const restoreCommonJsGlobals = `
  if (window.__umdModule !== undefined) window.module = window.__umdModule;
  if (window.__umdExports !== undefined) window.exports = window.__umdExports;
  if (window.__umdDefine !== undefined) window.define = window.__umdDefine;
`

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: hideCommonJsGlobals }} />
          <script src="https://unpkg.com/moment@2.29.1/moment.js" />
          <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" />
          <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" />
          <script src="https://unpkg.com/antd@4.24.16/dist/antd.js" />
          <script dangerouslySetInnerHTML={{ __html: restoreCommonJsGlobals }} />
          <link rel="stylesheet" href="https://unpkg.com/antd@4.24.16/dist/antd.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
