import DataTable from 'react-data-table-component';



interface IStudentTable {
  data : {
    name: string;
    ra: string;
    isOk : string
  }
}
const handleRowClick = (row) => {
  alert(`Você clicou na linha de ${row.name}`);
};
export function StudentTable({data} : IStudentTable) {
  
  const columns = [
    {
        name: 'Nome',
        selector: row => row.name,
    },
    {
        name: 'RA',
        selector: row => row.ra,
    },
    {
      name: 'Acertos',
      selector: row => row.isOk,
  },
];

    return (
        <DataTable
            columns={columns}
            data={data}
            onRowClicked={handleRowClick} 
        />
    );
};