import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const formatCell = (value) => {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : formatCurrency(value);
  }
  const maybeDate = new Date(value);
  if (!Number.isNaN(maybeDate.getTime()) && String(value).includes(':')) {
    return formatDate(value);
  }
  return value;
};

const ReportDetail = () => {
  const { type } = useParams();
  const [report, setReport] = useState({ title: '', columns: [], rows: [] });

  useEffect(() => {
    apiRequest(`/admin/reports/${type}`).then(setReport).catch(() => setReport({ title: 'Report', columns: [], rows: [] }));
  }, [type]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/admin/reports" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
        <p className="text-gray-600 mb-8">Live data from your MySQL database.</p>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-200">
                {report.columns.map((column) => (
                  <th key={column} className="text-left py-3 px-3 text-sm font-semibold text-gray-700">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100">
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="py-3 px-3 text-sm text-gray-700">{formatCell(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {report.rows.length === 0 && <p className="text-gray-500">No data available.</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default ReportDetail;
