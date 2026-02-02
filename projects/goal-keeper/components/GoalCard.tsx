import React, {useState} from 'react';
import { Goal, Log } from '@/models/interfaces';
import ProgressChart from './ProgressChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, ListBulletIcon, BarChartIcon } from '@radix-ui/react-icons';
import { Pencil, Trash2Icon } from 'lucide-react';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/togglegroup';
import { DatePicker } from '@/components/ui/datepicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PastWeekChart from './PastWeekChart';
import LogEntryForm from './LogEntryForm';
import AddGoalModal from './AddGoalModal';
import { createPortal } from 'react-dom';
import { gkDB } from '@/models/db';

interface GoalCardProps {
  goal: Goal;
  logs: Log[];
  type: string;
  unit: string;
  startDate: Date;
  endDate: Date;
  addedLogs?: number[];
  setAddedLogs?: (logIds: number[]) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, logs, type, unit, startDate, endDate, addedLogs, setAddedLogs }) => {
  const [shownChartState, setShownChartState] = useState("pastWeek");
  const [currentPage, setCurrentPage] = useState(0); // Track the current page for the log table
  const logsPerPage = 10; // Number of logs to show per page
  const [editingLogRowState, setEditingLogRowState] = useState(0); // Track if a log row is being edited
  const [editValue, setEditValue] = React.useState<number>(0); // Track the value of the log being edited
  const [editDate, setEditDate] = React.useState<Date>(new Date());
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);

  const paginatedLogs = logs.slice(currentPage * logsPerPage, (currentPage + 1) * logsPerPage); // Logs for the current page

  const handleNextPage = () => {
    if ((currentPage + 1) * logsPerPage < logs.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startEditingRow = (log: Log) => {
    setEditDate(new Date(log.date));
    setEditValue(log.value);
    setEditingLogRowState(log.id || 0);
  };

  const handleEditLogSave = async (logId: number) => {
    const updatedLog = logs.find(log => log.id === logId);
    if (updatedLog) {
      if(type === "countUp") {
        updatedLog.value = editValue;
      } else if(type === "stepUp") {
        updatedLog.date = editDate;
      }
      // Logic to save the edited log value
      const test = await gkDB.logs.put(updatedLog);
      console.log('update response: ', test);
    }
  }

  const handleDelete = async (logId: number) => {
    if(logId) {
      gkDB.logs.delete(logId);
    }
  };

  const returnLogRowCells = (log: Log) => {
    if(editingLogRowState === log.id) {
      return (
        <>
          {type === "countUp" && (
            <>
              <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Input type="number" value={editValue} onChange={(e) => {setEditValue(parseInt(e.target.value))}} />
              </TableCell>
            </>
            )}
          {type === "stepUp" && (
            <>
              <TableCell>
                <DatePicker
                  date={editDate}
                  setDate={(date: Date | undefined) => date && setEditDate(date)}
                />
              </TableCell>
              <TableCell>{log.value}</TableCell>
            </>
          )}
          
          <TableCell>
            <Button
              onClick={() => {
                handleEditLogSave(log.id || 0);
                setEditingLogRowState(0);
              }}
              className="hover:cursor-pointer"
            >Save</Button>
          </TableCell>
          <TableCell className="text-right">
            <Button 
              onClick={() => setEditingLogRowState(0)}
              className="hover:cursor-pointer"
            >
              <Trash2Icon />
            </Button>
          </TableCell>
        </>
      );
    }
    return (
      <>
        <TableCell className="font-medium">{new Date(log.date).toLocaleDateString()}</TableCell>
        <TableCell>{log.value}</TableCell>
        <TableCell><Pencil size={20} strokeWidth={1} className="group-hover:cursor-pointer hover:scale-110" onClick={(e)=>startEditingRow(log)} /></TableCell>
        <TableCell className="flex justify-end"><Trash2Icon size={20} strokeWidth={1} className="group-hover:cursor-pointer hover:scale-110" onClick={(e)=>handleDelete(log.id||0)}/></TableCell>
      </>
    );
  }

  return (
          <div className="goalDetailsParent m-4 flex flex-col md:flex-row">
            <div className="goalDetailsContent min-w-2xs mr-4 p-4 bg-white shadow-md rounded-lg w-full md:w-[300px]">
              <div className="goalRewardDetailsParent bg-gray-100 p-4 rounded-lg border border-gray-300">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-gray-700">Goal Details</h4>
                  <button onClick={() => setShowEditGoalModal(true)} className="ml-2 p-1 rounded hover:bg-gray-200" title="Edit Goal">
                    <Pencil size={20} />
                  </button>
                </div>
                <div className="goalRewardDetailsRow flex justify-between mb-2">
                  <p className="text-sm text-gray-600">{goal.baseLabel}</p>
                  <p className="text-sm font-medium text-gray-800">{goal.baseValue} {unit} per {goal.countFrequency}</p>
                </div>
                <div className="goalRewardDetailsRow flex justify-between">
                  <p className="text-sm text-gray-600">{goal.reachLabel}</p>
                  <p className="text-sm font-medium text-gray-800">{goal.reachValue} {unit} per {goal.countFrequency}</p>
                </div>
              </div>
              {showEditGoalModal && createPortal(
                <AddGoalModal
                  setShowModal={setShowEditGoalModal}
                  selectedSession={null}
                  addedGoals={[]}
                  setAddedGoals={() => {}}
                  goalToEdit={goal}
                  isEditMode={true}
                />,
                document.body
              )}
              <LogEntryForm
                goalType={goal.type}
                goalId={goal.id}
                goalUnit={unit}
                logs={logs}
                addedLogs={addedLogs}
                setAddedLogs={setAddedLogs}
              />
              <div className="shownChartToggleparent mt-4">
                <ToggleGroup
                  type="single"
                  defaultValue="pastWeek"
                  className="w-full"
                  onValueChange={(value) => {
                    setShownChartState(value);
                  }}
                >
                  <ToggleGroupItem value="pastWeek" className="w-full flex justify-center items-center">
                    <CalendarIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="logs" className="w-full flex justify-center items-center">
                    <ListBulletIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="progress" className="w-full flex justify-center items-center">
                    <BarChartIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            <div className={`goalDetailsGraph ${shownChartState === "logs" ? "lg:mx-24 md:mx-16" : ""} flex-grow mt-4 md:mt-0 md:ml-4 p-4 bg-white shadow-md rounded-lg`}>
            { shownChartState === "pastWeek" && (
              <div className="last-7-days-chart">
                <h3 className="text-md font-semibold mb-3">Last 7 Days Progress</h3>
                <PastWeekChart
                  logs={logs}
                  baseLabel={goal.baseLabel}
                  baseValue={goal.baseValue}
                  reachLabel={goal.reachLabel}
                  reachValue={goal.reachValue}
                  unit={unit}
                />
              </div>
            )}
            { shownChartState === "logs" && (
              <div className="logsTableParent">
                <Table>
                  <TableCaption>Logged {unit}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Edit</TableHead>
                      <TableHead className="text-right">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { paginatedLogs.map((log) => (
                      <TableRow key={log.id}>
                        { returnLogRowCells(log) }
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="paginationControls flex justify-center mt-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className={`mr-2 px-4 py-2 rounded-md ${currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    {'<'}
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={(currentPage + 1) * logsPerPage >= logs.length}
                    className={`ml-2 px-4 py-2 rounded-md ${(currentPage + 1) * logsPerPage >= logs.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            )}
            { shownChartState === "progress" && (
              <ProgressChart
                logs={logs || []}
                type={type}
                baseLabel={goal.baseLabel}
                baseValue={goal.baseValue}
                reachLabel={goal.reachLabel}
                reachValue={goal.reachValue}
                countFrequency={goal.countFrequency}
                startDate={startDate}
                endDate={endDate}
              />
            )}
            </div>
          </div>
  );
};

export default GoalCard;