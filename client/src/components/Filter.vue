<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h4 class="m-0">Filter Result</h4>
            <div class="dropdown">
              <button class="btn btn-primary dropdown-toggle" type="button" @click="showDropdown = !showDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Export as
              </button>
              <div class="main-con-filter" @click="showDropdown = !showDropdown" v-if="showDropdown"></div>

              <div class="dropdown-menu show" v-show="showDropdown">
                <a class="dropdown-item pointer" @click="exportFilters('txt')">
                  <i class="fa fa-file-text-o mr-2" aria-hidden="true"></i>
                  Txt File
                </a>
                <download-csv
                  :data="json_data" :name="csvName">
                  <a class="dropdown-item pointer" @click="exportFilters('csv')">
                    <i class="fa fa-file-o mr-2" aria-hidden="true"></i>
                    Csv File
                  </a>
                </download-csv>
                <a class="dropdown-item pointer" @click="exportFilters('json')">
                  <i class="fa fa-file mr-2" aria-hidden="true"></i>
                  Json File
                </a>
                <download-excel
                    :data="json_data" :name="excelName">
                    <a class="dropdown-item pointer" @click="exportFilters('xls')">
                      <i class="fa fa-file-excel-o mr-2" aria-hidden="true"></i>
                      Excel File
                    </a>
                </download-excel>
              </div>
            </div>
          </div>
          <div class="mt-3 mb-3">
            <multiselect
              v-model="selectedFilters"
              :options="multiselectOptions"
              :close-on-select="false"
              :multiple="true"
              placeholder="Select Filters"></multiselect>
          </div>

          <div v-if="amounts.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(150, 199, 211); color: white">Amount</div>
            <ul class="list-group" v-for="(item, index) in amounts" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="netAmounts.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(133, 155, 205); color: white">Net Amount</div>
            <ul class="list-group" v-for="(item, index) in netAmounts" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="ibans.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(123, 193, 170); color: white">IBAN</div>
            <ul class="list-group" v-for="(item, index) in ibans" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="bics.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(147, 133, 205); color: white">BIC</div>
            <ul class="list-group" v-for="(item, index) in bics" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="invoices.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(109, 140, 185); color: white">Invoice</div>
            <ul class="list-group" v-for="(item, index) in invoices" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="address.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(166, 163, 163); color: white">Invoice</div>
            <ul class="list-group" v-for="(item, index) in address" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="invoiceDates.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(112, 171, 206); color: white">Invoice Date</div>
            <ul class="list-group" v-for="(item, index) in invoiceDates" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="articles.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(75, 105, 130); color: white">Articles</div>
            <ul class="list-group" v-for="(item, index) in articles" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="phones.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(183, 133, 205); color: white">Phone</div>
            <ul class="list-group" v-for="(item, index) in phones" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="vats.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(205, 133, 155); color: white">Vat ID</div>
            <ul class="list-group" v-for="(item, index) in vats" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
          <div v-if="creditorName.length" class="mt-2">
            <div class="card-header mb-1" style="background: rgb(224, 143, 151); color: white">Creditor Name</div>
            <ul class="list-group" v-for="(item, index) in creditorName" :key="index">
                <li class="list-group-item mb-1">{{item}}</li>
            </ul>
          </div>
    </div>
</template>

<script>
import JsonCSV from 'vue-json-csv';
import JsonExcel from 'vue-json-excel';
import Multiselect from 'vue-multiselect';

export default {
    props: {
        'propText': String,
        'highlightInput': String,
        'auto': {
            type: Boolean,
            default: false
        }
    },

    components: {
        Multiselect,
        'download-csv': JsonCSV,
        'download-excel': JsonExcel,
    },

    watch: {
        selectedFilters: function() {
            this.filter()
            this.highlight(this.queries)
        },

        propText: function(newVal){
            this.text = newVal;
            this.filter();
            this.highlight(this.queries);
        }
    },

    mounted() {
        if(this.auto){
            this.selectedFilters = this.multiselectOptions
        }else{
            this.selectedFilters = []
        }
    },

    data(){
        return {
            showDropdown: false,
            json_data: [],
            csvName: 'default.csv',
            excelName: 'default.xls',
            text: this.propText,

            amounts: [],
            netAmounts: [],
            ibans: [],
            bics: [],
            address: [],
            invoices: [],
            invoiceDates: [],
            articles: [],
            phones: [],
            vats: [],
            creditorName: [],

            selectedFilters: [],
            multiselectOptions: ['Amount','Address', 'Net Amount', 'IBAN', 'BIC', 'Invoice Number', 'Invoice Date', 'Articles', 'Phone', 'Vat ID', 'Creditor Name'],
            queries: [],
        }
    },

    methods: {
        exportFilters(type){
            switch(type){
                case 'txt':
                this.downloadTxt();
                break;
                case 'csv':
                this.downloadCsv();
                break;
                case 'json':
                this.downloadJson();
                break;
                case 'xls':
                this.downloadExcel();
                break;
            }
        },

        downloadTxt(){
            this.showDropdown = false;

            let filePath = this.textExport();
            let link = document.createElement('a');
            link.href = filePath;
            link.download = this.getFileName('txt')
            link.click()
        },

        downloadExcel(){
            this.showDropdown = false;
            /* if(!this.attachments.length) return; */

            this.excelName = this.getFileName('xls');
            this.calculateJson();
        },

        downloadCsv(){
            this.showDropdown = false;
            /* if(!this.attachments.length) return; */

            this.csvName = this.getFileName('csv');
            this.calculateJson();
        },

        downloadJson(){
            this.showDropdown = false;
            /* if(!this.attachments.length) return; */

            this.calculateJson();
            let filename = this.getFileName('json');

            const json = JSON.stringify(this.json_data);
            const dataURL = `data:application/json,${json}`;

            let anchor = document.createElement('a');
            anchor.setAttribute("download", `${filename}`);
            anchor.setAttribute("href", dataURL);
            anchor.click()
        },

        pushFiles(jsonFile, arr, filter){
            arr.forEach((item, index) => {
                if (jsonFile.length) {
                let obj = {}
                obj[filter] = item
                jsonFile[index] = {...jsonFile[index], ...obj}
                } else {
                let obj = {}
                obj[filter] = item
                jsonFile.push(obj)
                }
            })
        },

        calculateJson(){
            let jsonFile = []

            this.selectedFilters.forEach(filter => {
                switch(filter){
                case 'BIC':
                    this.pushFiles(jsonFile, this.bics, filter)
                    break;
                case 'IBAN':
                    this.pushFiles(jsonFile, this.ibans, filter)
                    break;
                case 'Amount':
                    this.pushFiles(jsonFile, this.amounts, filter)
                    break;
                case 'Net Amount':
                    this.pushFiles(jsonFile, this.netAmounts, filter)
                    break;
                case 'Invoice Number':
                    this.pushFiles(jsonFile, this.invoices, filter)
                    break;
                case 'Address':
                    this.pushFiles(jsonFile, this.address, filter)
                    break;
                case 'Invoice Date':
                    this.pushFiles(jsonFile, this.invoiceDates, filter)
                    break;
                case 'Phone':
                    this.pushFiles(jsonFile, this.phones, filter)
                    break;
                case 'Vat ID':
                    this.pushFiles(jsonFile, this.vats, filter)
                    break;
                case 'Creditor Name':
                    this.pushFiles(jsonFile, this.creditorName, filter)
                    break;
                }
            })

            this.json_data = jsonFile;
        },

        getFileName(ext){
            const date = new Date()
            let today = date.toISOString().slice(0, 10)
            return `Document-${today}-${Date.now()}.${ext}`
        },

        textCreator(arr){
            let temp = '';
            arr.forEach((item, index) => {
                if (this.ibans.length == index + 1) {
                temp += item
                } else {
                temp += item + ', '
                }
            })
            temp += '\n'
            return temp
        },

        textExport() {
            let text = ''

            this.selectedFilters.forEach(filter => {
                switch(filter){
                case 'BIC':
                    text += 'BIC: ' + this.textCreator(this.ibans)
                    break;
                case 'IBAN':
                    text += 'IBAN: ' + this.textCreator(this.ibans)
                    break;
                case 'Amount':
                    text += 'Amount: ' + this.textCreator(this.amounts)
                    break;
                case 'Net Amount':
                    text += 'Net Amount: ' + this.textCreator(this.netAmounts)
                    break;
                case 'Invoice Number':
                    text += 'Invoice Number: ' + this.textCreator(this.invoices)
                    break;
                case 'Address':
                    text += 'Address: ' + this.textCreator(this.address)
                    break;
                case 'Invoice Date':
                    text += 'Invoice Date: ' + this.textCreator(this.invoiceDates)
                    break;
                case 'Phone':
                    text += 'Phone: ' + this.textCreator(this.phones)
                    break;
                case 'Vat ID':
                    text += 'Vat ID: ' + this.textCreator(this.vats)
                    break;
                case 'Creditor Name':
                    text += 'Creditor Name: ' + this.textCreator(this.creditorName)
                    break;
                }
            })
            let data = new Blob([text], {type: 'text/plain'});

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (this.textFile !== null) {
                window.URL.revokeObjectURL(this.textFile);
            }

            this.textFile = window.URL.createObjectURL(data);

            return this.textFile;
        },

        filter() {
            this.amounts = []
            this.netAmounts = []
            this.ibans = []
            this.bics = []
            this.address = []
            this.invoices = []
            this.invoiceDates = []
            this.articles = []
            this.phones = []
            this.vats = []
            this.creditorName = []

            this.queries = []

            this.selectedFilters.forEach(filter => {
                if(filter == 'Amount'){
                    let regex = [
                        /(Endsumme|Rechnungsbetrag)\s.{3,10}?\s[a-zA-Z]{0}/gi
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.amounts.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(150, 199, 211)'});
                        });
                    })
                }else if(filter == 'Net Amount'){
                    let regex = [
                        /Summe\sNetto\s.{3,10}?\s[a-zA-Z]{0}/gi
                    ];
                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.netAmounts.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(133, 155, 205)'});
                        });
                    })
                }else if (filter == 'IBAN') {
                    let regex = [
                        /DE\d{2}\s?([0-9a-zA-Z]{4}\s?){4}[0-9a-zA-Z]{2}/g,
                        /DE\d{2}\s?([0-9a-zA-Z]{2}\s?){2}[0-9a-zA-Z]{2}\s?([0-9]{3}?)\s?([0-9]{3}?)\s?([0-9]{2}?).([0-9]{2}?)/gi,
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.ibans.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(123, 193, 170)'});
                        });
                    })
                }else if(filter == 'BIC'){
                    let regex = [
                        /BIC\d?:?\d?\s.{11}/gi,
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.bics.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(147, 133, 205)'});
                        });
                    })
                }else if(filter == 'Invoice Number'){
                    let regex = [
                        /lieferschein\s?[nr.]{0,3}?\s\d{2,20}/gi,
                        /invoice\s\d{2,20}/gi,
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.invoices.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(109, 140, 185)'});
                        });
                    });
                }else if(filter == 'Address'){
                    let regex = [
                        /(\s+\w+)\s(?:str(?:\.|Str)?|dr(?:\.|Straße)?|pl(?:\.|ace)?|Musterstrasse (?:\.|Schnurlos-Straße)?|Str.|Schnurlos-Straße|Str|Beispielstr).[0-9]{2}\s[0-9]{5}/gi ||
                        /(\s+\w+)\s(?:str(?:\.|Str)?|Schnurlos-Straße(?:\.|Straße)?|pl(?:\.|ace)?|ave(?:\.|nue)?|Str.|Schnurlos-Straße|Str|Beispielstr).[0-9]{2}\s[0-9]{5}/gi ||
                        /(\s+\w+)\s(?:str(?:\.|Str)?|Beispielstr.(?:\.|Straße)?|Str.(?:\.|Schnurlos-Straße)?|Schnurlos-Straße(?:\.|nue)?|Str.|Schnurlos-Straße|Str|Beispielstr|Musterstrasse|Ingelheimer ).[0-9]{2}\s[0-9]{5}/gi,
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.address.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(166, 163, 163)'});
                        });
                    })
                }
                else if(filter == 'Invoice Date'){
                    let regex = [
                        /(rechnungs)?datum\s?:?\s?([1|2][0-9]|[0]?[1-9]|[3][0|1])[./-\s]?([0]?[1-9]|[1][0-2])[./-\s]?([0-9]{4}|[0-9]{2})/gi,
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.invoiceDates.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(112, 171, 206)'});
                        });
                    })
                }else if(filter == 'Phone'){
                    let regex = [
                        /Telefon\s?:?\s?[0-9() /]{6,20}/gi,
                        /Phone\s?:?\s?[0-9() /]{6,20}/gi,
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.phones.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(183, 133, 205)'});
                        });
                    })
                }else if(filter == 'Vat ID'){
                    let regex = [
                        /Ust.{3,10}?\s[a-zA-Z]{2}\d{9}/gi,
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.vats.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(205, 133, 155)'});
                        });
                    })
                }else if(filter == 'Creditor Name'){
                    let regex = [
                        /Geschä?ftsfü?h(rer|rung)\s?:?\s?[a-zA-Z]{3,}(\s[a-zA-Z]{3,})?/gi,
                    ];

                    regex.forEach(reg => {
                        let filtered = [...this.text.matchAll(reg)];
                        filtered.forEach(element => {
                            this.creditorName.push(element[0]);
                            this.queries.push({element: element[0], color: 'rgb(224, 143, 151)'});
                        });
                    })
                }
            })
        },

        highlight(queries) {
            let inputText = document.getElementById(this.highlightInput);
            let innerHTML = this.text;
            // let innerHTML = inputText;
            if (queries.length == 0) {
                inputText.innerHTML = this.text
            }
            inputText.innerHTML = this.text
            queries.forEach(t => {
                let index = innerHTML.indexOf(t.element);
                if (index >= 0) {
                    innerHTML = innerHTML.substring(0,index) + '<span style="background-color: ' + t.color +'; color: #fff">' + innerHTML.substring(index,index+t.element.length) + "</span>" + innerHTML.substring(index + t.element.length);
                    inputText.innerHTML = innerHTML;
                }
            })
        },
    },
}
</script>

<style lang="css" scoped>
    .main-con-filter {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 105;
        width: 100%;
        height: 100%;
    }
    button:focus {
        outline:0 !important;
        box-shadow: none;
    }
    .btn-primary{
        color: #fff;
        background-color: rgb(47, 46, 65);
        border-color: rgb(47, 46, 65);
    }
    .multiselect{
        font-size: 14px;
    }
    .highlight {
        background-color: rgb(255, 166, 0);
    }
    .custom-control-input:checked, .custom-control-label::after{
        border-color: rgb(47, 46, 65);
        background-color: rgb(47, 46, 65);
    }
    .custom-control-input:checked~.custom-control-label::before {
        color: #fff;
        border-color: rgb(47, 46, 65);
        background-color: rgb(47, 46, 65);
    }
    .pointer{
        cursor: pointer;
    }
</style>
