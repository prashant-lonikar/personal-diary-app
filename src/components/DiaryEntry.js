import React from 'react';

function DiaryEntry({ date, content, image }) {
  return (
    <div className="diary-entry">
      <h2>{date}</h2>
      <p>{content}</p>
      {image && <img src={image} alt="Diary entry" />}
    </div>
  );
}

export default DiaryEntry;