import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFinanceStore from '../../stores/financeStore';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { format } from 'date-fns';
import { Edit2 } from 'lucide-react';

const FeeStructureListPage = () => {
  const { feeStructures, fetchFeeStructures, isLoading } = useFinanceStore();

  useEffect(() => {
    fetchFeeStructures();
  }, [fetchFeeStructures]);

  const columns = [
    {
      label: 'Title',
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-800">{row.title}</p>
          <span className="text-xs text-slate-500 uppercase">{row.type?.replace('_', ' ')}</span>
        </div>
      )
    },
    {
      label: 'Applicable To',
      render: (_, row) => row.course?.title || row.batch?.name || 'Global'
    },
    {
      label: 'Amount',
      render: (_, row) => (
        <span className="font-semibold text-slate-900">
          ₹{Number(row.amount).toLocaleString()}
        </span>
      )
    },
    {
      label: 'Due Date',
      render: (_, row) => row.dueDate ? format(new Date(row.dueDate), 'dd MMM yyyy') : 'No Due Date'
    },
    {
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Link 
            to={`/erp/fees/${row.documentId || row.id}/edit`}
            className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fee Structures" 
        subtitle="Manage program fees, admission charges, and custom dues"
        action={{
          label: 'Add Fee Structure',
          icon: 'add',
          href: '/erp/fees/new'
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <DataTable
          columns={columns}
          data={feeStructures}
          isLoading={isLoading}
          emptyTitle="No Fee Structures Found"
          emptyDescription="Create a global or course-specific fee structure to begin recording payments."
        />
      </div>
    </div>
  );
};

export default FeeStructureListPage;
