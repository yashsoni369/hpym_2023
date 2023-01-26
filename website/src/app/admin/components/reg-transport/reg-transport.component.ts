import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-reg-transport',
  templateUrl: './reg-transport.component.html',
  styleUrls: ['./reg-transport.component.scss']
})
export class RegTransportComponent implements OnInit {

  constructor(private service: AdminService) { }
  loading = false;
  chartOptions;
  mandalBus = { east: {}, asalpha: {}, badlapur: {}, sarvodaya: {}, nagar: {}, mulund: {}, thane: {}, kurla: {}, vikhroli: {}, vadil: {} }
  ngOnInit(): void {
    this.mandalWiseBus();

  }

  mandalWiseBus() {
    this.loading = true;
    this.service.dashMandalBus().subscribe((res: any) => {
      // this.mandalBus = {};
      res.data.forEach(d => {
        if (d._id.toLowerCase().includes('east')) {
          this.mandalBus.east[d._id] = {};
          this.mandalBus.east[d._id].bus = d.byBus
          this.mandalBus.east[d._id].self = d.bySelf
        }
        else if (d._id.toLowerCase().includes('badlapur')) {
          this.mandalBus.badlapur[d._id] = {};
          this.mandalBus.badlapur[d._id].bus = d.byBus
          this.mandalBus.badlapur[d._id].self = d.bySelf
        }
        else if (d._id == 'AsalphaHimalaya (Bal)') {
          !this.mandalBus.asalpha['Asalpha (Bal)'] ? this.mandalBus.asalpha['Asalpha (Bal)'] = {} : '';
          this.mandalBus.asalpha['Asalpha (Bal)'].bus += d.byBus
          this.mandalBus.asalpha['Asalpha (Bal)'].self += d.bySelf
        }
        else if (d._id.toLowerCase().includes('asalpha')) {
          this.mandalBus.asalpha[d._id] = {};
          this.mandalBus.asalpha[d._id].bus = d.byBus
          this.mandalBus.asalpha[d._id].self = d.bySelf
        }



        else if (d._id.toLowerCase().includes('sarvodaya') || d._id.toLowerCase().includes('west') || d._id.toLowerCase().includes('gopal')) {
          this.mandalBus.sarvodaya[d._id] = {};
          this.mandalBus.sarvodaya[d._id].bus = d.byBus
          this.mandalBus.sarvodaya[d._id].self = d.bySelf
        }
        else if (d._id.toLowerCase().includes('nagar')) {
          this.mandalBus.nagar[d._id] = {};
          this.mandalBus.nagar[d._id].bus = d.byBus
          this.mandalBus.nagar[d._id].self = d.bySelf
        }
        else if (d._id.toLowerCase().includes('mulund')) {
          this.mandalBus.mulund[d._id] = {};
          this.mandalBus.mulund[d._id].bus = d.byBus
          this.mandalBus.mulund[d._id].self = d.bySelf
        }
        else if (d._id.toLowerCase().includes('thane')) {
          this.mandalBus.thane[d._id] = {};
          this.mandalBus.thane[d._id].bus = d.byBus
          this.mandalBus.thane[d._id].self = d.bySelf
        }
        else if (d._id.toLowerCase().includes('kurla')) {
          this.mandalBus.kurla[d._id] = {};
          this.mandalBus.kurla[d._id].bus = d.byBus
          this.mandalBus.kurla[d._id].self = d.bySelf
        }
        else if (d._id.toLowerCase().includes('vikhroli')) {
          this.mandalBus.vikhroli[d._id] = {};
          this.mandalBus.vikhroli[d._id].bus = d.byBus
          this.mandalBus.vikhroli[d._id].self = d.bySelf
        }
        else if (d._id.toLowerCase().includes('vadil')) {
          this.mandalBus.vadil[d._id] = {};
          this.mandalBus.vadil[d._id].bus = d.byBus
          this.mandalBus.vadil[d._id].self = d.bySelf
        }

      });
      // res.data.forEach(d => {
      //   if (d._id.includes('Vadilo')) {
      //     !this.mandalBus[d._id] ? this.mandalBus[d._id] = {} : ''
      //     this.mandalBus[d._id]['Male'] = {};
      //     this.mandalBus[d._id]['Male']['bus'] = d.byBus
      //     this.mandalBus[d._id]['Male']['self'] = d.bySelf;
      //   }
      //   else if (d._id.includes('Vadil Beno')) {
      //     !this.mandalBus['Vadilo'] ? this.mandalBus['Vadilo'] = {} : ''
      //     this.mandalBus['Vadilo']['Female'] = {};
      //     this.mandalBus['Vadilo']['Female']['bus'] = d.byBus
      //     this.mandalBus['Vadilo']['Female']['self'] = d.bySelf;
      //   }
      //   else if (d._id.includes('Yuvati')) {
      //     !this.mandalBus[d._id.split(' (')[0]] ? this.mandalBus[d._id.split(' (')[0]] = {} : ''
      //     this.mandalBus[d._id.split(' (')[0]]['Female'] = {}
      //     this.mandalBus[d._id.split(' (')[0]]['Female']['bus'] = d.byBus
      //     this.mandalBus[d._id.split(' (')[0]]['Female']['self'] = d.bySelf;
      //   }
      //   else if (d._id == "AsalphaHimalaya (Bal)") {
      //     !this.mandalBus['Asalpha'] ? this.mandalBus['Asalpha'] = {} : ''
      //     this.mandalBus['Asalpha']['Male'] = {};
      //     this.mandalBus['Asalpha']['Male']['bus'] += d.byBus
      //     this.mandalBus['Asalpha']['Male']['self'] += d.bySelf;

      //   }
      //   else {
      //     !this.mandalBus[d._id.split('-').join(' ')] ? this.mandalBus[d._id.split('-').join(' ')] = {} : '';
      //     this.mandalBus[d._id.split('-').join(' ')]['Male'] = {};
      //     this.mandalBus[d._id.split('-').join(' ')]['Male']['bus'] = d.byBus
      //     this.mandalBus[d._id.split('-').join(' ')]['Male']['self'] = d.bySelf;
      //   }

      //   // if (d._id == 'Ghatkopar-East') {
      //   //   this.mandalBus['East']['Male'].bus = d.byBus
      //   //   this.mandalBus['East']['Male'].direct = d.bySelf
      //   // }
      //   // else if (d._id == 'Ghatkopar East (Yuvati)') {
      //   //   this.mandalBus['East']['Female'].bus = d.byBus
      //   //   this.mandalBus['East']['Female'].direct = d.bySelf
      //   // }
      //   // else if (d._id == 'Badlapur') {
      //   //   this.mandalBus['East']['Female'].bus = d.byBus
      //   //   this.mandalBus['East']['Female'].direct = d.bySelf
      //   // }

      // });
      console.log(res.data)
      console.log(this.mandalBus)
      // this.mandalDash = res.data;

      var balarr = [];
      var yuvatiarr = [];
      var yuvakarr = [];
      for (const mandal in this.mandalBus) {
        // asalpha
        this.mandalBus[mandal]

        if (mandal == 'vadil') {
          yuvakarr.push(this.mandalBus[mandal]['Vadilo']?.bus || 0)
          yuvatiarr.push(this.mandalBus[mandal]['Vadil Beno']?.bus || 0)
        }
        else {
          // bal , yuvak, yuvati
          if (!Object.keys(this.mandalBus[mandal]).find(k=> k.includes('Bal'))) {
            balarr.push(0)
          }
          if (!Object.keys(this.mandalBus[mandal]).find(k=> k.includes('Yuvati'))) {
            yuvatiarr.push(0)
          }
          for (const area in this.mandalBus[mandal]) {
              if (area.toLowerCase().includes('bal')) {
                balarr.push(this.mandalBus[mandal][area].bus);
              }
              else if (area.toLowerCase().includes('yuvati')) {
                yuvatiarr.push(this.mandalBus[mandal][area].bus);
              }
              else {
                yuvakarr.push(this.mandalBus[mandal][area].bus);
              }
          }

        }
      }

      this.chartOptions = {
        series: [{
        name: 'PRODUCT A',
        data: yuvakarr
      }, {
        name: 'PRODUCT B',
        data: yuvatiarr
      }, {
        name: 'PRODUCT C',
        data: balarr
      }],
        chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        },
      },
      xaxis: {
        type: 'datetime',
        categories: [
        ],
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
      };
      console.log(yuvakarr, yuvatiarr, balarr)
      this.loading = false
    },
      err => {
        this.loading = false
      })
  }
  // east,asalpha,badlapur,sarvodaya,chiragnagar,mulund,thane,kurla,vikhroli,vadilo
}
