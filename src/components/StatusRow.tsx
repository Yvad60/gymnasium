import { Cell, Row } from "@atlaskit/table-tree";
import { FC } from "react";
type User = {
  name: string;
  age: number;
  hasChildren: boolean;
  children?: User[];
};

type Props = {
  data: User[];
  age: number;
};

const StatusRow: FC<Props> = (props) => {
  console.log("here are the recived props", props);

  return (
    <div>
      <Row items={props.children} hasChildren={props.children} {...props}>
        <Cell>aaa</Cell>
        <Cell>aaa</Cell>
      </Row>
      <div className="" style={{ background: "red" }}>
        Hello there how are you now
      </div>
    </div>
  );
};
export default StatusRow;
