import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from 'styled-components';
import { func } from 'prop-types';

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

function readFile(file, onUpload) {
    const reader = new FileReader();
  
    reader.onload = event => {
      onUpload(file, btoa(event.target.result));
    };
  
    reader.readAsBinaryString(file);
  }


export const PhotoWidgetDropzone = (props) => {

  const onDrop = useCallback(
      acceptedFiles => {
        acceptedFiles.forEach(file => readFile(file, props.onUpload));
      },
      [props.onUpload],
  );

  const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject
    } = useDropzone({
      accept: ['image/jpeg', 'image/png'],
      onDrop,
      multiple: true,
    });
  
  return (
    <div className="container">
      <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Container>
    </div>
  );

};

PhotoWidgetDropzone.propTypes = {
    onUpload: func.isRequired,
}
