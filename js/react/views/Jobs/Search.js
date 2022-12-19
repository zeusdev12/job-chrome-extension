import React from 'react';
import { Form, FormGroup, Input } from 'reactstrap';

const Search = ({ searchTextBox, searchTextBoxChange }) => {

  return (
    <div style={{ width: '31%', marginLeft: '2%' }}>
      <Input name="job-text"
        id="job-text"
        placeholder="Search Jobs"
        className="job-input"
        value={searchTextBox}
        onChange={searchTextBoxChange}
      />
    </div>
  );
}

export default Search;