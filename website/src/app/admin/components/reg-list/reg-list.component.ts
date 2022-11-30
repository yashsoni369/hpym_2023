import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
declare var bootstrap: any;
declare let $: any;
import { users } from "../../roles";
@Component({
  selector: 'app-reg-list',
  templateUrl: './reg-list.component.html',
  styleUrls: ['./reg-list.component.scss']
})
export class RegListComponent implements OnInit {

  constructor(private service: AdminService, private fb: FormBuilder) { }
  loading = false;
  autoResizeWidth = true;
  loginModal;
  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.loginModal = new bootstrap.Modal(document.getElementById('loginModal'), {});
    this.loginModal.show();
    // this.getAllRegs();


    // return table;
  }

  columns = [
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
      field: (v) => v.sampark['FollowUp Name'] ? v.sampark['FollowUp Name'] : 'NONE'
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

  source;

  getAllRegs() {
    this.loading = true;
    this.service.getAll().subscribe(
      (res: any) => {
        this.source = res.data.regs
        this.loading = false;

        $(document).ready(function () {
          var table = $("#tableName").DataTable({
            "autoWidth": true,
            scrollX: true,
            dom: 'Blfrtip',
            buttons: [
              {
                extend: 'excel',
                split: ['copy', 'csv', 'pdf', 'print']
              }
            ]
          });

          //       table.buttons().container()
          // .appendTo( $('.col-sm-6:eq(0)', table.table().container() ) );
        });          // info: false,
        // searching: false,
        // paging: true,
        // bFilter: false,
        // bInfo: false,
        // 'dom': 'Rlfrtip',
        // 'colReorder': {
        //   'allowReorder': false
        // },
        // order: [[2, "asc"]]
        // });
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

  // Login
  onLogin() {
    if(this.loginForm.valid) {
      var loginData = this.loginForm.value;
      var u = users.find(s=> s.emailId == loginData.username && s.password == loginData.password);
      if(u) {
        this.loginModal.hide();
        this.getAllRegs();
        this.loginForm.value;
      }
      else {
        this.loginForm.reset();
      }
    }
  }

}
