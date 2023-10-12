import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { CardExercicios } from '../professor/CardExercicios';

const ListExercises = ({ exercises }) => {
  return (
    <Grid templateColumns={{md: "repeat(3, 1fr)"}} gap={10}>
      {exercises?.map((exercise: any, key) => (
        <GridItem key={key}>
          <CardExercicios
            name={exercise?.name}
            description={exercise?.description}
            date={new Date(exercise?.dueDate).toLocaleDateString()}
            maxAttempts={exercise?.maxAttempts}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default ListExercises;
