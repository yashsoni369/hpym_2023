import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ExcelService } from 'src/app/services/excel.service';
declare var bootstrap: any;
declare let $: any;
import { users } from "../../roles";
@Component({
  selector: 'app-reg-list',
  templateUrl: './reg-list.component.html',
  styleUrls: ['./reg-list.component.scss']
})
export class RegListComponent implements OnInit {

  constructor(private service: AdminService, private fb: FormBuilder, private excelService: ExcelService) { }
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

  exportexcel() {
    var newarr = [];
    var srno = 1;
    this.source.forEach(s => {
      // var copy = Object.assign({}, s, s.sampark); // we can add as many object as we need.
      // s = copy;
      let merged = { ...s, ...s['sampark'] };
      delete merged['sampark'];
      merged['Sr no'] = srno;
      srno++;
      merged["Age"] = this.calculateAge(merged['Birth Date']);
      merged["isNew"] = merged["isNew"] == true ? "Yes" : "No";
      merged["sslRegistered"] = merged["sslRegistered"] == 1 ? "Yes" : "No";
      merged['Full Name'] = merged['First Name'] + " " + merged['Middle Name'] + " " + merged["Last Name"];
      delete merged['_id']
      newarr.push(merged);
    });
    this.excelService.exportAsExcelFile(newarr, "HPYM_Regs")
  }

  getAllRegs() {
    this.loading = true;
    this.service.getAll().subscribe(
      (res: any) => {
        if (this.loginForm.get('username').value == 'vaibhav@hpym.com') {
          this.source = res.data.regs
        }
        else if (this.loginForm.get('username').value.includes('yuvati')) {
          var sabha = users.find(u => u.emailId == this.loginForm.get('username').value).role;
          this.source = res.data.regs.filter(r => r.sampark.Sabha == sabha);
        }
        else {
          var area = users.find(u => u.emailId == this.loginForm.get('username').value).role;
          this.source = res.data.regs.filter(r => r.sampark.Sabha.toLowerCase().includes(area.toLowerCase()) && !r.sampark.Sabha.includes('Yuvati'));

          if (area == 'Sarvodaya') {
            this.source = this.source.concat(res.data.regs.filter(r => r.sampark.Sabha == 'Gopal Bhuvan (Bal)'))
          }
          if(area == 'Chirag Nagar') {
            this.source = this.source.concat(res.data.regs.filter(r => r.sampark.Sabha == 'Maneklal (Bal)'))
          }

        }
        this.loading = false;

        var thisref = this;

        $(document).ready(function () {
          var columnDefs: any = [
          ];
          var buttonContents = '<button class="btn btn-info btn-sm edit-btn" style="color:white"><i class="fa fa-pencil-square-o"></i></button>';
          if (thisref.loginForm.get('username').value == 'vaibhav@hpym.com') {
            buttonContents = '<button class="btn btn-danger btn-sm delete-btn"><i class="fa fa-trash"></i></button> ' + buttonContents;
          }
          columnDefs.push({
            targets: 1,
            data: null,
            defaultContent: buttonContents,
          },
            // {
            //   targets: 2,
            //   data: 'seva',
            //   "render": function (data, type, row, meta) {
            //     return '<input disabled type="number" min="0" max="1200" class="form-control seva-box" value="' + data + '"/>';
            //   }
            //   // defaultContent: '<input type="number" value="'++'"',
            // }
          );

          // excel seva column
          var buttonCommon = {
            exportOptions: {
              format: {
                body: function (data, row, column, node) {
                  // Strip $ from salary column to make it numeric
                  // debugger
                  if (column === 1) {
                    return '';
                  }
                  else if (column === 2) {
                    var inputId = $(data).attr('id');
                    debugger
                    // return Number.parseInt($('#'+inputId).val())
                    return Number.parseInt($(data).val())
                  }
                  else if (column === 3) {
                    return ($(data).val())
                  }

                  return data;
                }
              }
            }
          };


          var table = $("#tableName").DataTable({
            "autoWidth": true,
            scrollX: true,
            dom: 'lfrtip',
            scrollCollapse: true,
            fixedColumns: {
              // left: 1,
              right: 1
            },
            // buttons: [
            //   $.extend(true, {}, buttonCommon, {
            //     extend: 'excelHtml5'
            //   }),
            //   $.extend(true, {}, buttonCommon, {
            //     extend: 'print'
            //   }),
            //   // {
            //   //   extend: null,
            //   //   split: ['copy', 'csv', 'pdf', 'print']
            //   // }
            // ],
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
            thisref.UnRegisterMember(data[5], data[11], data[4]);
            $(this).off('click');
          });

          $('#tableName tbody').on('click', 'button.edit-btn', function () {
            // var data = table.row($(this).parents('tr')).data();
            var dis = $(this).closest('td').siblings().find('.seva-box')[0].disabled;
            $(this).closest('td').siblings().find('.seva-box')[0].disabled = !dis;
            $(this).off('click');
          });


        });

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
      // this.loading = false

      this.confirmModal.hide();
    },
      err => {
        this.toDeleteData = null;
        this.loading = false

        this.confirmModal.hide();
      })
  }

  updateTransport(transport, id) {
    console.log(transport, id);
    this.loading = true;
    this.service.updateTransport({ id, transport }).subscribe(res => {
      this.loading = false;
    },
      err => {
        alert('Update Error! Try again later')
        this.loading = false;
      })
  }

  updateSeva(amount, mobile) {
    this.loading = true;
    var d = this.source.find(s => s.sampark['Mobile'] == mobile);
    console.log(d);
    this.service.updateSeva({ id: d._id, seva: amount }).subscribe(res => {
      this.loading = false;
      // $('.mobile_no:contains("' + mobile + '")').closest('td').prev().prev().find('.seva-box')[0].disabled = true
      $('.mobile_no:contains("' + mobile + '")').closest('tr').find('.seva-box')[0].disabled = true
    },
      err => {
        alert('Update Error! Try again later')
        this.loading = false;
      })
  }

  // Login
  onLogin() {
    if (this.loginForm.valid) {
      var loginData = this.loginForm.value;
      var u: any = [];

      u = users.find(s => s.emailId == loginData.username && s.password == loginData.password);

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
