import DataTable from "./components/DataTable";
import StockSelectorModal from "./components/StockSelectorModal";

export default function Home() {
  
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl flex justify-center font-bold mb-4">Stock Data Tracker</h1>
      <div className="mb-4">
        <StockSelectorModal />
      </div>
      <DataTable />
    </div>
    </>
  );
}
