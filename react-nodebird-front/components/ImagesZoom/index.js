import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

import {
  Overlay,
  Header,
  CloseBtn,
  SlickWrapper,
  ImgWrapper,
  Indicator,
  Global,
} from './styles';
import { backUrl } from '../../config/config';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose} />
      </Header>
      <SlickWrapper>
        <div>
          <Slider
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img
                  src={
                    process.env.NODE_ENV === 'production'
                      ? v.src.replace(/\/thumb\//, '/original/')
                      : `${backUrl}/${v}`
                  }
                  alt={v.src}
                />
              </ImgWrapper>
            ))}
          </Slider>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
