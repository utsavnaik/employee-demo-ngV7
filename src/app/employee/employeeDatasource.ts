import { EmployeeModel } from './models/employee.model';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EmployeeService } from './services/employee.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, map, mergeMap } from 'rxjs/operators';
import {forkJoin} from 'rxjs';
export class EmployeeDataSource implements DataSource<EmployeeModel> {
    fetchData = 250;
    private employee$: Observable<EmployeeModel[]>;
    private employeeSubject = new BehaviorSubject<EmployeeModel[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private employeeService: EmployeeService) {}

    connect(collectionViewer: CollectionViewer): Observable<EmployeeModel[]> {
        return this.employeeSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.employeeSubject.complete();
        this.loadingSubject.complete();
    }

    loadAllEmployees(field:string,direction= 'asc',pageIndex = 0, pageSize = 10,filterValue = '') {
      if(pageIndex == 0 && (pageIndex * pageSize) < this.fetchData ) {
        //   if(pageIndex) {
                forkJoin(this.employeeService.getAllEmployee(field,direction,pageIndex, this.fetchData,filterValue)
                ,this.employeeSubject)
                .pipe(
                    map(([Nemp,oemp]) => {
                        console.log('xcxcx',oemp);
                        return [...Nemp,...oemp]   
                    })
                )
                .subscribe({
                    next: value => {
                      console.log('employee data',value)
                       this.employeeSubject.next(value)
                    },
                    error:value => console.log(value.error),
                    complete: () => console.log('This is how it ends!'),
                   });     
            // } 
          }
            
      }    
}
