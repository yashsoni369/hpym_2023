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
  toDeleteData;

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

  source;

  getAllRegs() {
    this.loading = true;
    this.service.getAll().subscribe(
      (res: any) => {
        if (this.loginForm.get('username').value == 'vaibhav@hpym.com') {
          this.source = res.data.regs
        }
        else {
          var area = users.find(u => u.emailId == this.loginForm.get('username').value).role;
          this.source = res.data.regs.filter(r => r.sampark.Sabha.toLowerCase().includes(area.toLowerCase()) && !r.sampark.Sabha.includes('Yuvati'));

        }
        this.loading = false;

        var thisref = this;

        $(document).ready(function () {
          var columnDefs = [];
          thisref.loginForm.get('username').value == 'vaibhav@hpym.com' ? columnDefs.push({
            targets: 1,
            data: null,
            defaultContent: '<button class="btn btn-danger btn-sm delete-btn"><i class="fa fa-trash"></i></button>',
          }) : '';
          var table = $("#tableName").DataTable({
            "autoWidth": true,
            scrollX: true,
            dom: 'Blfrtip',
            buttons: [
              {
                extend: 'excel',
                split: ['copy', 'csv', 'pdf', 'print']
              }
            ],
            columnDefs: columnDefs

            // { visible: false, targets: [3] } // hide from UI but not in Excel
            // {
            //   "targets": 1,
            //   "data": "sampark",
            //   "render": function (data, row, meta, d, e, f) {
            //     console.log(data, row, meta, d)
            //     return '<button class="btn btn-danger btn-sm" title="' + data + '" value="' + data + '"><i class="fa fa-trash"></i></button>'
            //   }
            // },
            // {
            //   targets: 1,
            //   data: null,
            //   defaultContent: '<button class="btn btn-danger btn-sm delete-btn"><i class="fa fa-trash"></i></button>',
            // }
            // ]
          });

          $('#tableName tbody').on('click', 'button.delete-btn', function () {
            var data = table.row($(this).parents('tr')).data();
            thisref.UnRegisterMember(data[3], data[9], data[2])
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
  confirmModal;
  UnRegisterMember(mobileNo, isNew, firstName) {
    this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'), {});
    this.confirmModal.show();
    this.toDeleteData = { mobileNo, isNew, firstName };
    // var cm = new bootstrap.Modal(document.getElementById('confirmModal'), {});
    // cm.show();

  }

  unRegisterApiCall() {
    this.loading = true;
    const { mobileNo, isNew } = this.toDeleteData;
    this.service.deRegisterMember({ mobileNo, isNew }).subscribe(res => {
      $("#tableName").DataTable().destroy();
      this.getAllRegs();
      this.toDeleteData = null;
      this.loading = false

      this.confirmModal.hide();
    },
      err => {
        this.toDeleteData = null;
        this.loading = false

        this.confirmModal.hide();
      })
  }

  // Login
  onLogin() {
    if (this.loginForm.valid) {
      var loginData = this.loginForm.value;
      var u = users.find(s => s.emailId == loginData.username && s.password == loginData.password);
      if (u) {
        this.loginModal.hide();
        this.getAllRegs();
        this.loginForm.value;
      }
      else {
        this.loginForm.reset();
      }
    }
  }

  calculateAge(birthday) { // birthday is a date
    birthday = new Date(birthday.split('-').reverse().join('-'))
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}
