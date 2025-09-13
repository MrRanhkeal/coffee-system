import { Button, Image, Radio, Modal } from "antd";
import React from "react";
import { Config } from "../../util/config";
import styles from "./ProductItem.module.css";
import { MdAddCircle } from "react-icons/md";
import PropTypes from "prop-types";
function ProductItem({
  id,
  name,
  description,
  image, 
  images = [], // new prop for multiple images, default to empty array
  category_name,
  brand,
  price,
  discount,
  // barcode,
  handleAdd,
  qty,
}) {
  const [sugarLevel, setSugarLevel] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const imageList = images.length > 0 ? images : [image];
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);

  const handleAddWithSugar = () => {
    handleAdd({
      id,
      name,
      description,
      image: imageList[selectedImageIdx], // Use selected image
      category_name,
      brand,
      price,
      discount,
      qty,
      sugarLevel: sugarLevel
    });
    setSugarLevel(0); // Reset sugar to 0% after add to cart
    setModalOpen(false);
  };


  const handleImageClick = () => {
    setModalOpen(true);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIdx((prev) => (prev + 1) % imageList.length);
  };

  var final_price = price;
  if (discount != 0 && discount != null) {
    final_price = price - (price * discount) / 100;
    final_price = final_price.toFixed(2);
  }
  return (
    <div className={styles.contianer} >
      <Image
        src={Config.image_path + imageList[selectedImageIdx]}
        alt={name}
        preview={false}
        style={{ borderRadius: '20px', width: '350px', height: '230px', justifyContent: 'center', cursor: 'pointer' }}
        onClick={handleImageClick}
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        width={400}
        height={450}
      >
        <div style={{ 
          // width: '100%',
          // height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', width: '350px', height: '300px' }}>
            <Image
              src={Config.image_path + imageList[selectedImageIdx]}
              alt={name}
              preview={false}
              style={{ borderRadius: '10px', width: '350px', height: '290px' }}
            />
            <div>
              <div style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>
                {name} &nbsp;
                {description}
              </div>
              <div style={{ fontWeight: 'bold', color: 'green', marginRight: '5px' }}>${price} &nbsp;&nbsp;&nbsp; <span style={{ color: 'red', fontWeight: 'bold', marginRight: '5px' }}> {discount}%</span> <span style={{ color: 'red', fontSize: '12px' }}>off</span><br /></div>
              <span style={{ color: 'black', fontSize: '14px',fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' ,fontWeight:'bold'}}>១ កែវ</span>
            </div>
            {imageList.length > 1 && (
              <>
                <Button
                  style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
                  onClick={handlePrevImage}
                  size="small"
                >{`<`}</Button>
                <Button
                  style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                  onClick={handleNextImage}
                  size="small"
                >{`>`}</Button>
              </>
            )}
          </div>
          <br />
          <br />
          <br />
          <div style={{ marginTop: 16, width: '100%', backgroundColor: '#ebd4d1ff', borderRadius: '5px' }}>
            <span style={{ fontSize: '14px', margin: '30px 10px 30px 10px', fontWeight: 'bold' }}>Choice of Sugar Levels</span>
            <br />
            <span style={{ margin: '10px 0 0 10px',fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ជ្រើសរើស 1 <text style={{ marginLeft: '220px', backgroundColor: '#dc7970ff', borderRadius: '10px',width: '100px', padding: '5px', color: 'white', fontSize: '12px', fontWeight: 'bold',fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>ត្រូវការ</text></span>
            <br />
            <br />
            <Radio.Group
              value={sugarLevel}
              onChange={(e) => setSugarLevel(e.target.value)}
              //style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}
              style={{ display: 'grid', flexWrap: 'wrap', gap: '2px' ,margin:'0 0 15px 0'}}
            >
              <Radio style={{ marginLeft: '6px' ,fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}} value={0}>ជាតិស្ករ ០% <text style={{ marginLeft: '210px',color: '#e90b0bff' }}>free</text></Radio>
              <Radio style={{ marginLeft: '6px' ,fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}} value={10}>ជាតិស្ករ ១០% <text style={{ marginLeft: '202px',color: '#e90b0bff' }}>free</text></Radio>
              <Radio style={{ marginLeft: '6px' ,fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}} value={25}>ជាតិស្ករ ២៥% <text style={{ marginLeft: '200px',color: '#e90b0bff' }}>free</text></Radio>
              <Radio style={{ marginLeft: '6px' ,fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}} value={50}>ជាតិស្ករ ៥០% <text style={{ marginLeft: '200px' ,color: '#e90b0bff'}}>free</text></Radio>
              <Radio style={{ marginLeft: '6px' ,fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}} value={75}>ជាតិស្ករ ៧៥% <text style={{ marginLeft: '198px',color: '#e90b0bff' }}>free</text></Radio>
              <Radio style={{ marginLeft: '6px' ,fontFamily: 'Noto Sans Khmer, Roboto, sans-serif'}} value={100}>ជាតិស្ករ ១០០% <text style={{ marginLeft: '190px',color: '#e90b0bff' }}>free</text></Radio>
              <br />
              <br />
              <br />
            </Radio.Group>
          </div>
          {/* <div
            style={{
              marginTop: 16, width: '100%',
              backgroundColor: '#d74c19ff',
              borderRadius: '5px'
            }}
          >discription </div> */}
          <Button
            type="primary"
            style={{ marginTop: 16, width: '100%',fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}
            icon={<MdAddCircle />}
            onClick={handleAddWithSugar}  
          >
            បញ្ចូលទៅកន្ត្រក
          </Button>
        </div>
      </Modal>
      <div className={styles.p_name + " truncate-text"} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' ,margin:'0 0 0 6px'}}>
        {name}
        {/* {description} */}
      </div>
      <div className={styles.p_des}>
        {/* {category_name} - {brand} */}
      </div>
      {/* <div className={styles.p_des}>{description}</div> */}
      {/* <div className={styles.p_des}>
        <Tag color={qty <= 0 ? 'red' : 'green'}>
          {qty <= 0 ? 'Out of Stock' : 'In Stock'}
        </Tag>
      </div> */}
      {discount != 0 && discount != null ? (
        <div className={styles.p_price_container}>
          <div className={styles.p_price}>{price}$</div>
          <div className={styles.p_dis}> {discount}%</div>
          <div className={styles.p_final_price}> {final_price}$</div>
        </div>
      ) : (
        <div className={styles.p_price_container} style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif',margin:'0 0 10px 6px' }}>តម្លៃ &nbsp;&nbsp;
          <div className={styles.p_final_price}>${price}</div>
        </div>
      )}
      <div className={styles.p_des}>
        <Radio.Group
          value={sugarLevel}
          onChange={(e) => setSugarLevel(e.target.value)}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}
        >
          {/* <Radio value={0}>0%</Radio> */}
          {/* <Radio value={25}>25%</Radio>
          <Radio value={50}>50%</Radio>
          <Radio value={75}>75%</Radio>
          <Radio value={100}>100%</Radio> */}
        </Radio.Group>
      </div>
      <div className={styles.btnAddContainer}>
        <Button
          // onClick={handleAddWithSugar}
          onClick={handleImageClick}
          // size="small"
          type="primary"
          icon={<MdAddCircle />}
        />
      </div>
    </div>
  );
}
ProductItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  category_name: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  discount: PropTypes.number,
  // barcode: PropTypes.string.isRequired,
  handleAdd: PropTypes.func.isRequired,
  qty: PropTypes.number.isRequired,
};

export default ProductItem;
