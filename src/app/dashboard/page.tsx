import { Card, CardHeader } from "@heroui/react";

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
            </Card>
      </div>
      </>
    );
}