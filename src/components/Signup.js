import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const navigate = useNavigate();
    const [credentials, setCredentials] = useState({name: "", email : "", password: "", cpassword : ""})
    const handleSubmit = async (e)=> {
        e.preventDefault();
        const {name, email, password} = credentials;
        const response = await fetch("http://127.0.0.1:5000/api/auth/createuser", {
            method : "POST", 
            headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({name, email, password})
      });
        const json = await response.json();
        console.log(json);
        if(json.success) {
          localStorage.setItem('token', json.authtoken);
          props.showAlert("Successfully SignedUp ", "success")
          navigate('/');
        }
        else {
          props.showAlert("Invalid Details ", "danger")

        }
    }
  
    const onChange= (e)=> {
        setCredentials({...credentials, [e.target.name] : e.target.value})
    }
    return (
        <div className = "container mt-2 mb-1">
          <h2>Create an account</h2>
            <form onSubmit = {handleSubmit}>
            <div class="form-group">
    <label htmlhtmlFor="name">Name</label>
    <input type="name" class="form-control" id="exampleInputPassword1"  name = "name" onChange={onChange}placeholder="name"/>
  </div>
  <div class="form-group">
    <label htmlFor="email">Email address</label>
    <input type="email" class="form-control" id="email" aria-describedby="emailHelp"  name = "email" onChange={onChange} placeholder="Enter email"/>
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group">
    <label htmlFor="password">Password</label>
    <input type="password" class="form-control" id="password" name = "password" onChange={onChange} placeholder="Password" minLength={5} required/>
  </div>
  <div class="form-group">
    <label htmlFor="password">Confirm Password</label>
    <input type="password" class="form-control" id="cpassword" name = "cpassword" onChange={onChange} placeholder="Password" minLength={5} required/>
  </div>
  <div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
    <label class="form-check-label" htmlFor="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
        </div>
    )
}

export default Signup