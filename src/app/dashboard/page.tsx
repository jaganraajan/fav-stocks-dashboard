"use client"

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
} from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/react";


const rows = [
    {
      key: "1",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "2",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "3",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "4",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
  ];
  
  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "role",
      label: "ROLE",
    },
    {
      key: "status",
      label: "STATUS",
    },
  ];



  
export default function Page() {
    return( 
    <>
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">Favourite Stocks Dashboard</h1>
            
            <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
                Stocks
                </h2>
                <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-200">Companies per page:</span>
                <span className="text-sm text-gray-600 dark:text-gray-200">15</span>
                </div>
            </CardHeader>
            <CardBody>
                <Table 
                    aria-label="Wallets table"
                    classNames={{
                    base: "max-w-full",
                    table: "min-w-full border-collapse border border-gray-200 dark:border-gray-700",
                    thead: "bg-gray-100 dark:bg-gray-700",
                    tbody: "bg-white dark:bg-gray-900",
                    tr: "border-b border-gray-200 dark:border-gray-700",
                    th: "text-left p-3 text-gray-800 dark:text-gray-200 font-semibold",
                    td: "p-3 text-gray-800 dark:text-gray-200",
                    }}
                >
                    <TableHeader columns={columns}>
                {(column) => <TableColumn  key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={rows}>
                {(item) => (
                    <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardBody>
            </Card>
      </div>
      </>
    );
}