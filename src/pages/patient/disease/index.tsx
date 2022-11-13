export default function Diseases(props: any) {}

export async function getServerSideProps(context: any) {
  const res = await fetch("http://localhost:3000/api/disease");
  const data = await res.json();
  console.log(data);
  return {
    props: {},
  };
}
