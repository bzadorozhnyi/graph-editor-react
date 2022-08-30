import '../styles/Animation.css';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import customDeepCopy from '../customDeepCopy';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from "uuid";
import gifshot from 'gifshot';
import { saveAs } from 'file-saver';

function generateNewFrame(frame) {
    let newFrame = customDeepCopy(frame);
    frame.edgeInputs.forEach(edgeInput => {
        edgeInput.edgeInputId = uuidv4();
    });
    return newFrame;
}

function Animation(props) {
    let { getPNG, frames, setFrames, selectedFrameIndex, setSelectedFrameIndex } = props;
    const [images, setImages] = useState([null]);

    function changeFrame(_, index) {
        // update image of current frame
        images[selectedFrameIndex] = getPNG();

        setImages([...images]);
        setSelectedFrameIndex(index);
    };

    function addNewFrame() {
        let newFrames = [...frames];
        newFrames.push(generateNewFrame(frames[selectedFrameIndex]));
        setFrames(customDeepCopy(newFrames));

        images.push(getPNG());
        setImages([...images]);
    }

    function deleteFrame() {
        if (frames.length === 1) {
            return;
        }

        // remove current frame and image
        frames.splice(selectedFrameIndex, 1);
        images.splice(selectedFrameIndex, 1);

        // if index of frame was last it must be updated
        if (selectedFrameIndex === frames.length) {
            setSelectedFrameIndex(frames.length - 1);
        }

        setFrames([...frames]);
        setImages([...images]);
    }

    function generateGIF() {
        // get image of current frame because it update only after choosing new index
        images[selectedFrameIndex] = getPNG();

        gifshot.createGIF({
            gifWidth: 600,
            gifHeight: 600,
            images: images,
            frameDuration: 1,
            interval: 0.5
        }, function (obj) {
            if (!obj.error) {
                saveAs(obj.image, 'algorithm.gif');
            }
        });
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        let newSelectedFrameIndexChecked = selectedFrameIndex;

        // reorder data
        const newFrames = Array.from(frames);
        const [reorderedFrames] = newFrames.splice(result.source.index, 1);
        newFrames.splice(result.destination.index, 0, reorderedFrames);

        // reorder images
        const newImages = Array.from(images);
        const [reorderedImages] = newImages.splice(result.source.index, 1);
        newImages.splice(result.destination.index, 0, reorderedImages);

        // change checked index
        if (newSelectedFrameIndexChecked === result.source.index) {
            newSelectedFrameIndexChecked = result.destination.index;
        }
        else if (result.destination.index <= newSelectedFrameIndexChecked && newSelectedFrameIndexChecked < result.source.index) {
            newSelectedFrameIndexChecked += 1;
        }
        else if (result.source.index < newSelectedFrameIndexChecked && newSelectedFrameIndexChecked <= result.destination.index) {
            newSelectedFrameIndexChecked -= 1;
        }

        if (selectedFrameIndex !== newSelectedFrameIndexChecked) {
            setSelectedFrameIndex(newSelectedFrameIndexChecked);
        }

        setFrames(newFrames);
        setImages(newImages);
    }

    return (
        <div className='panel'>
            <div id='sticky-menu'>
                <div className='buttons-wrapper'>
                    <div style={{ display: 'flex' }}>
                        <Button
                            color='success'
                            onClick={addNewFrame}
                            style={{ margin: '10px' }}
                            variant='outlined'>
                            Add as new frame
                        </Button>
                        <Button
                            color='secondary'
                            onClick={generateGIF}
                            style={{ margin: '10px' }}
                            variant='outlined'>
                            Generate GIF
                        </Button>
                    </div>
                    <Button
                        color='error'
                        onClick={deleteFrame}
                        style={{ margin: '10px' }}
                        variant='outlined'>
                        Delete Frame
                    </Button>
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='frames-list'>
                    {(provided) => (
                        <div className='frames-list' {...provided.droppableProps} ref={provided.innerRef}>
                            {frames.map((frame, index) => {
                                return (
                                    <Draggable key={index.toString() + '-id'} draggableId={index.toString() + '-id'} index={index}>
                                        {(provided) => (
                                            <div
                                                className={selectedFrameIndex === index
                                                    ? 'frame row radio-div active'
                                                    : 'frame row radio-div'}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={(event) => changeFrame(event, index)}>
                                                {selectedFrameIndex === index
                                                    ? <div className='current-frame'>CURRENT FRAME</div>
                                                    : <img alt={`Frame ${index}`} src={images[index]} />}
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default Animation;