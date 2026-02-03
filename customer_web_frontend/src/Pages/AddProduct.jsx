import { useState } from "react";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    details: "",
    availableStock: "",
    quantity: "",
    reviews: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach(key =>
      data.append(key, formData[key])
    );
    data.append("image", image);

    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: data
    });

    alert("Product Added ✅");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />
      <input name="details" placeholder="Details" onChange={handleChange} />
      <input name="availableStock" placeholder="Stock" onChange={handleChange} />
      <input name="quantity" placeholder="Quantity" onChange={handleChange} />
      <input name="reviews" placeholder="Reviews" onChange={handleChange} />

      <input type="file" onChange={e => setImage(e.target.files[0])} />

      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProduct;
