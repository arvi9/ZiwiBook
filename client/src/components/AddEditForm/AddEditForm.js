import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addPost, updatePost } from "../../app/features/memorie/postSlice";
import CustomButton from "../CustomButton/CustomButton";
import CustomInput from "../CustomInput/CustomInput";
import "./AddEditForm.css";

const AddEditForm = ({ Edit, post }) => {
  const [form, setForm] = useState({ title: "", body: "", image: "" });
  const [picture, setPicture] = useState(null);
  const dispatch = useDispatch();
  // post id
  const id = form._id || null;

  //displaying picture after upload handler
  const onChangePicture = (e) => {
    setPicture(URL.createObjectURL(e.target.files[0]));
  };

  //handling the memorie old fields for the update
  useEffect(() => {
    if (post) setForm({ ...post });
  }, [post]);

  //clearing the state for the newest user inputs
  const clear = () => {
    setForm({ title: "", body: "", image: "" });
  };

  //onChangeHandler
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  //onChangefile
  const onChangefile = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.files[0],
    });
  };
  
  //onsubmitHandler
  const onsubmitHandler = (event) => {
    event.preventDefault();
    if (post) {
      dispatch(updatePost({ id, form }));
    } else {
      dispatch(addPost(form));
    }
    clear();
  };

  return (
    <>
      <div className="Post-list-item">
        <h1 className="New-Post-Title">
          {post ? "Update your " : "Share a "}Memorie
        </h1>
        <form className="New-Post-Form" onSubmit={onsubmitHandler}>
          <CustomInput
            type="text"
            placeholder="title..."
            label="Title :"
            name="title"
            onChange={onChangeHandler}
            // error={error.title}
            value={form.title}
          />
          <hr />
          <img
            id="output"
            src={picture && picture}
            alt="your_image"
            width="100"
            height="100"
          />
          {/* <hr /> */}
          <CustomInput
            type="file"
            accept="image/gif, image/jpeg, image/png"
            onChange={(e) => {
              onChangePicture(e);
              onChangefile(e);
            }}
            name="image"
          />
          <CustomInput
            label="Description :"
            type="textarea"
            placeholder="content...."
            name="body"
            onChange={onChangeHandler}
            // error={error.body}
            value={form.body}
          />

          <CustomButton
            className="button button8"
            value={post ? "update" : "submit"}
            type="submit"
            disabled={!form.body || !form.title}
          />
        </form>
      </div>
    </>
  );
};

export default AddEditForm;
