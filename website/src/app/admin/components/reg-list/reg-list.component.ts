import { Component, OnInit } from '@angular/core';
import { GuiColumn, GuiPaging, GuiPagingDisplay, GuiSearching, GuiSorting, GuiSummaries, GuiFiltering, GuiDataType } from '@generic-ui/ngx-grid';
import { AdminService } from 'src/app/services/admin.service';
declare var bootstrap: any;

@Component({
  selector: 'app-reg-list',
  templateUrl: './reg-list.component.html',
  styleUrls: ['./reg-list.component.scss']
})
export class RegListComponent implements OnInit {

  constructor(private service: AdminService) { }
  loading = false;
  autoResizeWidth = true;
  ngOnInit(): void {
    this.getAllRegs();
  }

  columns: Array<GuiColumn> = [
    {
      header: 'First Name',
      field: (v) => v.sampark['First Name']
    },
    {
      header: 'Middle Name',
      field: (v) => v.sampark['Middle Name']
    },
    {
      header: 'Last Name',
      field: (v) => v.sampark['Last Name']
    },
    {
      header: 'Contact No',
      field: (v) => v.sampark['Mobile']
    },
    {
      header: 'Reference',
      field: (v) => v.sampark['Ref Name']
    },
    {
      header: 'Follow Up',
      field: (v) => v.sampark['Follow Up'] ? v.sampark['Follow Up'] : 'NONE'
    },
    {
      header: 'Sabha',
      field: (v) => v.sampark['Sabha']
    },
    {
      header: 'Is New',
      field: (v) => v.isNew ? 'Yes' : 'No',
      width: 80
    },
    {
      header: 'Transport',
      field: 'transport',
      width: 80
    },
    {
      header: 'Seva',
      field: 'seva',
      type: GuiDataType.NUMBER,
      summaries: {
        enabled: true,
        summariesTypes: ['sum']
      },
      width: 80
    },
    {
      header: 'Action',
      field: '_id',
      view: (v) => {
        return '<button class="btn btn-sm btn-outline-danger" title="Remove Registerations" (click)=' + this.removeRegisteration(v) + '><i class="fa fa-trash"></i></button>'
      },
      width: 80
    }
  ];

  sorting: GuiSorting = {
    enabled: true
  };

  summaries: GuiSummaries = {
    enabled: true
  };

  filtering: GuiFiltering = {
    enabled: true
  }

  searching: GuiSearching = {
    enabled: true,
    placeholder: 'Search Members'
  };

  paging: GuiPaging = {
    enabled: true,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 25, 50],
    pagerTop: false,
    pagerBottom: true,
    display: GuiPagingDisplay.BASIC
  };

  source;

  getAllRegs() {
    this.loading = true;
    this.service.getAll().subscribe(
      (res: any) => {
        this.source = res.data.regs
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    )
  }

  removeRegisteration(e) {
    console.log('eee');

    // var cm = new bootstrap.Modal(document.getElementById('confirmModal'), {});
    // cm.show();

  }

}
