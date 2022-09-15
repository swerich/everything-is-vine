import './App.css';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './auth.css';
import { useAuthContext } from './auth';

function NewWinery() {
  const { id } = useParams();

  const [data, setData] = useState({
    name: '',
    url: '',
    address: '',
    description: '',
    owner: '',
  });
  /*eslint-disable */
  const { token } = useAuthContext();
  /*eslint-enable */

  const { name, url, address, description, owner } = data;

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  async function submitWinery(event) {
    event.preventDefault();
    const newForm = { ...data };

    const locationUrl = `${process.env.REACT_APP_DJANGO_SERVICE}/api/wineries/`;
    const fetchConfig = {
      method: 'post',
      body: JSON.stringify(newForm),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(locationUrl, fetchConfig);
    if (response.ok) {
      navigate(`/`);
    }
  }

  return (
    <>
      <div className={'wrapper fadeInDown'}>
        <div id="formContent" className="fadeIn first">
          <form onSubmit={submitWinery}>
            {/* <h3 className= 'mt-4 display-3'>Signup Here</h3> */}
            <div className="fadeIn second">
              <div className="display-6 text-secondary mt-3">Winery Name</div>
              <input
                className="form-control"
                type="text"
                defaultValue={name}
                name="name"
                onChange={changeHandler}
                placeholder="Winery Name"
              />
            </div>
            <div className="fadeIn second">
              <div className="display-6 text-secondary mt-3">URL for Photo</div>
              <input
                className="form-control"
                type="url"
                value={url}
                name="url"
                onChange={changeHandler}
                placeholder="Enter URL"
              />
            </div>
            <div className="fadeIn third">
              <div className="display-6 text-secondary mt-3">Address</div>
              <input
                className="form-control"
                type="text"
                name="address"
                value={address}
                onChange={changeHandler}
                placeholder="Enter Address"
              />
            </div>
            <div className="fadeIn third">
              <div className="display-6 text-secondary mt-3">Owner Name</div>
              <input
                className="form-control"
                type="text"
                name="owner"
                value={owner}
                onChange={changeHandler}
                placeholder="Owner Name"
              />
            </div>
            <div className="fadeIn fourth">
              <div className="display-6 text-secondary mt-3">Description</div>
              <textarea
                className="form-control textarea mt-3"
                type="text"
                name="description"
                value={description}
                onChange={changeHandler}
                placeholder="Enter Description"
              />
            </div>
            <input type="submit" className="fadeIn fourth" value="Submit" />
            <p className="forgot-password text-center">
              Change your mind? <a href={`/`}>Home</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewWinery;
