import React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface ExportToolsProps {
  chartData: any[];
  portfolioData: any;
  technicalData: any;
}

export const ExportTools: React.FC<ExportToolsProps> = ({
  chartData,
  portfolioData,
  technicalData,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [exportDialog, setExportDialog] = React.useState(false);
  const [exportOptions, setExportOptions] = React.useState({
    priceData: true,
    technicalIndicators: true,
    portfolio: true,
    transactions: true,
  });

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToCSV = () => {
    const data = prepareExportData();
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `stock_data_${new Date().toISOString()}.csv`);
  };

  const exportToExcel = () => {
    const data = prepareExportData();
    const wb = XLSX.utils.book_new();
    
    if (exportOptions.priceData) {
      const priceWS = XLSX.utils.json_to_sheet(chartData);
      XLSX.utils.book_append_sheet(wb, priceWS, 'Price Data');
    }

    if (exportOptions.technicalIndicators) {
      const technicalWS = XLSX.utils.json_to_sheet(technicalData);
      XLSX.utils.book_append_sheet(wb, technicalWS, 'Technical Indicators');
    }

    if (exportOptions.portfolio) {
      const portfolioWS = XLSX.utils.json_to_sheet(portfolioData);
      XLSX.utils.book_append_sheet(wb, portfolioWS, 'Portfolio');
    }

    XLSX.writeFile(wb, `stock_analysis_${new Date().toISOString()}.xlsx`);
  };

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.text('Stock Analysis Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add chart as image
    const chartImage = await captureChart();
    if (chartImage) {
      doc.addImage(chartImage, 'PNG', 20, 40, 170, 100);
    }
    
    // Add technical indicators
    doc.addPage();
    doc.text('Technical Indicators', 20, 20);
    // Add more content...
    
    doc.save(`stock_report_${new Date().toISOString()}.pdf`);
  };

  const captureChart = async (): Promise<string | null> => {
    const chartElement = document.querySelector('.recharts-wrapper');
    if (!chartElement) return null;

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(chartElement as HTMLElement);
    return canvas.toDataURL('image/png');
  };

  const prepareExportData = () => {
    // Combine and format data based on export options
    const data: any = {};
    
    if (exportOptions.priceData) {
      data.priceData = chartData;
    }
    
    if (exportOptions.technicalIndicators) {
      data.technicalIndicators = technicalData;
    }
    
    if (exportOptions.portfolio) {
      data.portfolio = portfolioData;
    }
    
    return data;
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={handleExportClick}
      >
        Export
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          handleClose();
          setExportDialog(true);
        }}>
          Export Options...
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          exportToCSV();
        }}>
          Export to CSV
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          exportToExcel();
        }}>
          Export to Excel
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          exportToPDF();
        }}>
          Export to PDF
        </MenuItem>
      </Menu>

      <Dialog
        open={exportDialog}
        onClose={() => setExportDialog(false)}
      >
        <DialogTitle>Export Options</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.priceData}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    priceData: e.target.checked
                  })}
                />
              }
              label="Price Data"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.technicalIndicators}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    technicalIndicators: e.target.checked
                  })}
                />
              }
              label="Technical Indicators"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.portfolio}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    portfolio: e.target.checked
                  })}
                />
              }
              label="Portfolio Data"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.transactions}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    transactions: e.target.checked
                  })}
                />
              }
              label="Transaction History"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            setExportDialog(false);
            exportToExcel();
          }} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportTools;