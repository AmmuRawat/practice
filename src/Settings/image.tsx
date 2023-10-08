import React from 'react';
import { Image, ScrollView, Dimensions } from 'react-native';

interface ImageComponentProps {
    images: string[];
}

const ImageComponent: React.FC<ImageComponentProps> = ({ images }) => {
    const windowWidth = Dimensions.get('window').width;
    const imageSize = windowWidth / 4;

    return (
        <ScrollView>
            {images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={{ width: imageSize, height: imageSize }} />
            ))}
        </ScrollView>
    );
};

export default ImageComponent;
