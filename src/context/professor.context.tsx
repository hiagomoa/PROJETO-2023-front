import { createContext, useEffect, useState } from "react";

export interface IProfessorContext {
  selectedExercise: Exercise | undefined;
  handleSelectExercise: (exercise: Exercise) => void;
  updateExercise: () => Promise<void>;
  editExerciseDescription: string;
  setEditExerciseDescription: (description: string) => void;
  editHtmlExercise: string;
  setEditHtmlExercise: (html: string) => void;
  editDateExercise: string | undefined;
  setEditDateExercise: (date: string) => void;
  editMaxAttempts: number | undefined;
  setEditMaxAttempts: (maxAttempts: number) => void;
}

export interface Exercise {
  classId: string;
  className: string;
  created_at: string;
  deleted_at?: string;
  description: string;
  dueDate: string;
  html: string;
  id: string;
  maxAttempts: number;
  name: string;
  professorId: string;
  updated_at: string;
}

export const ProfessorContext = createContext({} as IProfessorContext);

export const ProfessorProvider = ({ children }: any) => {
  const [selectedExercise, setExercise] = useState<Exercise>();

  const handleSelectExercise = (exercise: Exercise) => {
    setExercise(exercise);
  };

  const updateExercise = async () => {
    if (!selectedExercise) return;
    if (
      !editExerciseDescription ||
      !editHtmlExercise ||
      !editDateExercise ||
      !editMaxAttempts
    )
      return;

    const newExercise: Exercise = {
      classId: selectedExercise.classId,
      className: selectedExercise.className,
      created_at: selectedExercise.created_at,
      deleted_at: selectedExercise.deleted_at,
      id: selectedExercise.id,
      name: selectedExercise.name,
      professorId: selectedExercise.professorId,
      updated_at: new Date().toISOString(),
      description: editExerciseDescription,
      html: editHtmlExercise,
      dueDate: editDateExercise,
      maxAttempts: editMaxAttempts,
    };
    const response = await fetch(
      `http://localhost:3001/exercise/${selectedExercise.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExercise),
      }
    );

    if (!response.ok) {
      throw new Error("Não foi possível atualizar o exercício");
    }
  };

  useEffect(() => {
    if (selectedExercise?.description) {
      setEditExerciseDescription(selectedExercise?.description);
    }
    if (selectedExercise?.html) {
      setEditHtmlExercise(selectedExercise?.html);
    }
    if (selectedExercise?.dueDate) {
      setEditDateExercise(selectedExercise?.dueDate.split(":00.")[0]);
    }
    if (selectedExercise?.maxAttempts) {
      setEditMaxAttempts(selectedExercise?.maxAttempts);
    }
  }, [selectedExercise]);

  const [editExerciseDescription, setEditExerciseDescription] =
    useState<string>("");
  const [editHtmlExercise, setEditHtmlExercise] = useState<string>("");
  const [editDateExercise, setEditDateExercise] = useState<
    string | undefined
  >();
  const [editMaxAttempts, setEditMaxAttempts] = useState<number | undefined>();

  return (
    <ProfessorContext.Provider
      value={{
        selectedExercise,
        handleSelectExercise,
        updateExercise,
        editExerciseDescription,
        setEditExerciseDescription,
        editHtmlExercise,
        editDateExercise,
        editMaxAttempts,
        setEditMaxAttempts,
        setEditDateExercise,
        setEditHtmlExercise,
      }}
    >
      {children}
    </ProfessorContext.Provider>
  );
};
