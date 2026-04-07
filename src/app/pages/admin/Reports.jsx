import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { FileText, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const reportRouteMap = {
  'User Report': 'users',
  'Sales Report': 'sales',
  'Product Report': 'products',
  'Transaction Report': 'transactions'
};

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    apiRequest('/admin/reports').then((data) => setReports(data.reports)).catch(() => setReports([]));
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and view platform reports from live database data</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reports.map((report, index) => (
            <motion.div key={report.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-gray-600 text-sm mb-5">{report.description}</p>
              <Link to={`/admin/reports/${reportRouteMap[report.title]}`} className="inline-flex items-center gap-2 text-green-700 font-semibold">
                View Report
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
