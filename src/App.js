import React, { useState, useEffect } from 'react';
import { Meme } from './components/meme';

const objectToQueryParam = (obj) => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return `?` + params.join('&');
};

function App() {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes').then((x) =>
      x.json().then((response) => setTemplates(response.data.memes)),
    );
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      {template && (
        <form
          onSubmit={async (e) => {
            e.preventDefautl();
            const params = {
              template_id: template.id,
              text0: topText,
              text1: bottomText,
              username: 'process.env.REACT_APP_IMGFLIP_USERNAME',
              password: 'process.env.REACT_APP_IMGFLIP_PASSWORD',
            };
            const response = await fetch(
              `https://api.imgflip.com/caption_image${objectToQueryParam(
                params,
              )}`,
            );
            const data = response.json();
            console.log(data);
          }}
        >
          <Meme template={template} />
          <input
            placeholder="top-text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
          <input
            placeholder="bottom-text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
          <button type="sumbit">create meme</button>
        </form>
      )}
      {!template && (
        <>
          <h1>Pick a meme</h1>
          {templates.map((template) => {
            return (
              <Meme
                template={template}
                onClick={() => {
                  setTemplate(template);
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
export default App;
