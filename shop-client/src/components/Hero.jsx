import React from 'react';

const Hero = () => {
    return (
        <div className="carousel w-full h-[420px]">
            <div id="slide1" className="carousel-item relative w-full">
                <img
                    src="https://i.ibb.co.com/q3RV180K/Gemini-Generated-Image-uyevaduyevaduyev-3.png"
                    className="w-full h-full object-cover" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide4" className="btn btn-circle text-white">❮</a>
                    <a href="#slide2" className="btn btn-circle text-white">❯</a>
                </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
                <img
                    src="https://i.ibb.co.com/Ps15Q53n/Gemini-Generated-Image-uyevaduyevaduyev-2.png"
                    className="w-full h-full object-cover" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide1" className="btn btn-circle text-white ">❮</a>
                    <a href="#slide3" className="btn btn-circle text-white">❯</a>
                </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
                <img
                    src="https://i.ibb.co.com/JFFZkJT4/Gemini-Generated-Image-uyevaduyevaduyev-1.png
"
                    className="w-full h-full object-cover" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" className="btn btn-circle text-white">❮</a>
                    <a href="#slide4" className="btn btn-circle text-white">❯</a>
                </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full">
                <img
                    src="https://i.ibb.co.com/bGDw90q/Gemini-Generated-Image-uyevaduyevaduyev.png"
                    className="w-full h-full object-cover" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide3" className="btn btn-circle text-white">❮</a>
                    <a href="#slide1" className="btn btn-circle text-white">❯</a>
                </div>
            </div>
        </div>
    );
};

export default Hero;