import React, { useState } from 'react';
import { db, storage } from './Config/Config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';

function AddProducts() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadError, setUploadError] = useState('');

  const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];

  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError('');
      } else {
        setImage(null);
        setImageError('Please select a valid image file type (png or jpg)');
      }
    } else {
      console.log('Please select your file');
    }
  };

  const handleAddProducts = async (e) => {
    e.preventDefault();
  
    if (!image) {
      setImageError('Please select an image for the product.');
      return;
    }
  
    const storageRef = ref(storage, `product-images/${image.name}`);
    try {
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
  
      const productData = {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
      };
  
      const productCollection = collection(db, 'Products');
      await setDoc(doc(productCollection), productData);
  
      setSuccessMsg('Product added successfully');
      setTitle('');
      setDescription('');
      setPrice('');
      document.getElementById('file').value='';
      setImageError('');
      setUploadError('');
      setTimeout(() => {
        setSuccessMsg('');
    }, 3000);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  return (
    <div className="container">
      <br />
      <br />
      <h1>Add Products</h1>
      <hr />
      {successMsg && (
        <div className="success-msg" style={{ backgroundColor: 'lightgreen', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          {successMsg}
        </div>
      )}
      <br />
      <form autoComplete="off" className="form-group" onSubmit={handleAddProducts}>
        <label>Product Title</label>
        <input type="text" className="form-control" required onChange={(e) => setTitle(e.target.value)} value={title}></input>
        <br />
        <label>Product Description</label>
        <input type="text" className="form-control" required onChange={(e) => setDescription(e.target.value)} value={description}></input>
        <br />
        <label>Product Price</label>
        <input type="number" className="form-control" required onChange={(e) => setPrice(e.target.value)} value={price}></input>
        <br />
        <label>Upload Product Image</label>
        <input type="file" id="file" className="form-control" required onChange={handleProductImg}></input>
        {imageError && (
          <div className="error-msg" style={{ backgroundColor: '#FD655C', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
            {imageError}
          </div>
        )}
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-success btn-md">
            SUBMIT
          </button>
        </div>
      </form>
      {uploadError && (
        <div className="error-msg" style={{ backgroundColor: '#FD655C', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          {uploadError}
        </div>
      )}
    </div>
  );
}

export default AddProducts;
