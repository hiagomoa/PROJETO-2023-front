import { useEffect, useState } from "react";

const getAnswers = async (exerciseID: string | undefined) => {
  return await fetch(
    `http://localhost:3000/api/answers/by-exercise/${exerciseID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export function DialogAfterDueDate({ id }: { id: string | undefined }) {
  const [answers, setAnswers] = useState<any>();

  useEffect(() => {
    async function t() {
      await getAnswers(id).then((data) => {
        setAnswers(data);
      });
    }
    t();
  }, [id]);


  return <>teste due date</>;
}
