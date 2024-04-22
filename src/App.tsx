import TableTree, { Header, Rows } from "@atlaskit/table-tree";
import StatusRow from "./components/StatusRow";

type User = {
  name: string;
  age: number;
  hasChildren: boolean;
  children?: User[];
};

const luckyFamily: User[] = [
  {
    name: "kamali",
    age: 40,
    hasChildren: true,
    children: [
      {
        name: "mudosa",
        age: 90,
        hasChildren: true,
      },
    ],
  },
  {
    name: "kamali",
    age: 40,
    hasChildren: true,
    children: [
      {
        name: "mudosa",
        age: 90,
        hasChildren: true,
      },
    ],
  },
];

const App = () => {
  return (
    <div>
      <TableTree>
        <Header>
          <Header>Name</Header>
          <Header>Age</Header>
        </Header>

        <Rows
          items={luckyFamily}
          render={(prop) => {
            console.log("here is the passed props", prop);
            if (prop.age === undefined) return <>hhh</>;
            return <StatusRow {...prop} />;
          }}
        />
      </TableTree>
    </div>
  );
};
export default App;
