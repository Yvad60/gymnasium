import { nanoid } from "nanoid";

enum ColumnType {
  Lead = "LEADS",
  Opportunities = "OPPORTUNITIES",
  Qualification = "QUALIFICATION",
  Proposition = "PROPOSITION",
}

interface Deal {
  title: string;
  organisation: string;
  amount: number;
  id: string;
  column: ColumnType;
}

interface Column {
  title: string;
  id: ColumnType;
  items: Deal[];
}

const initialLeads: Deal[] = [
  {
    title: "MTN with bundle",
    organisation: "National Police Rwanda",
    amount: 240000,
    id: nanoid(),
    column: ColumnType.Lead,
  },
  {
    title: "Free phone from MTN",
    organisation: "MTN Rwanda",
    amount: 45000,
    id: nanoid(),
    column: ColumnType.Lead,
  },
];

const initialOpportunities: Deal[] = [
  {
    title: "Lending customers electronic devices",
    organisation: "Rwnda revenue authaurity",
    amount: 12000,
    column: ColumnType.Opportunities,
    id: nanoid(),
  },
  {
    title: "Buying smartphone on good price",
    organisation: "National Police Rwanda",
    amount: 100000,
    id: nanoid(),
    column: ColumnType.Lead,
  },
];

const initialQualifications: Deal[] = [];

const initialPropositions: Deal[] = [];

export const columns: Column[] = [
  {
    title: "Leads",
    id: ColumnType.Lead,
    items: initialLeads,
  },
  {
    title: "Opportunities",
    id: ColumnType.Opportunities,
    items: initialOpportunities,
  },
  {
    title: "Qualifications",
    id: ColumnType.Qualification,
    items: initialQualifications,
  },
  {
    title: "Propositions",
    id: ColumnType.Proposition,
    items: initialPropositions,
  },
];
