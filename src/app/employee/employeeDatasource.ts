import { EmployeeModel } from './models/employee.model';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, concat, iif } from 'rxjs';
import { EmployeeService } from './services/employee.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, map, mergeMap, concatMap } from 'rxjs/operators';

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
            this.employeeService.getAllEmployee(field,direction,pageIndex, this.fetchData,filterValue)
            .pipe(
                concatMap((employeeObj$) => concat(employeeObj$,this.employeeSubject)),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((employees:EmployeeModel[]) => {
                console.log('eeeee',employees);
               this.employeeSubject.next(employees);
            });     
        } 
      }    
}
