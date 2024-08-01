import React from 'react';
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { emojis } from './emojis';

const EmojiPicker = ({ onSelectEmoji }) => (
  <Box
    position="absolute"
    bottom="50px"
    right="30px"
    bg="white"
    border="1px solid #ccc"
    borderRadius="md"
    p={2}
    boxShadow="md"
    width="300px" 
    height="300px" 
    overflowY="auto"
  >
    <Grid templateColumns="repeat(6, 1fr)" gap={1}>
      {emojis.map((emoji, index) => (
        <GridItem
          key={index}
          onClick={() => onSelectEmoji(emoji)}
          cursor="pointer"
          textAlign="center" 
          fontSize="1.5rem" 
        >
          {emoji}
        </GridItem>
      ))}
    </Grid>
  </Box>
);

export default EmojiPicker;
