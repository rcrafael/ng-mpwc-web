import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) {}

  receiptHtml: string = '';
  customerData:any = {
    name: 'John Doe',
    address: '123 Main St',
    transdate: new Date().toLocaleDateString()
  };

  ngOnInit(): void {
      this.http.get('/assets/xlsx/or_template.xlsx', { responseType: 'arraybuffer' }).subscribe(
      (response) => {
        const data = new Uint8Array(response);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Replace placeholders in the sheet
        for (const cell in worksheet) {
          if (cell.startsWith('!')) continue;

          const value = worksheet[cell].v;
          if (typeof value === 'string') {
              const replaced = value.replace(/\[([^\]]+)\]/g, (match, key) => {
              const value = this.customerData[key.trim()];
              return value !== undefined ? value : match;
            });
            
            worksheet[cell].v = replaced;
            worksheet[cell].w = replaced;
            worksheet[cell].h = replaced;
            worksheet[cell].r = replaced;
          }
        }

        console.log('WORKSHEET: ', worksheet);

        // Convert to HTML for preview
        this.receiptHtml = XLSX.utils.sheet_to_html(worksheet, {
          header: ''
        });

        
      },
      (error) => {
        console.error('Error loading Excel template:', error);
      }
    );
  }


  print(): void {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Receipt</title></head><body>');
      printWindow.document.write(this.receiptHtml);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

}
