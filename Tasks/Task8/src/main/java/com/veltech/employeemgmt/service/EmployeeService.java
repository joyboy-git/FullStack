package com.veltech.employeemgmt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.veltech.employeemgmt.Employee;
import com.veltech.employeemgmt.repository.EmployeeRepository;
@Component
public class EmployeeService {
	@Autowired
	private EmployeeRepository employeerepository;
	public void createEmployee(int id,String name,String dept) {
		Employee emp=new Employee(id,name,dept);
		employeerepository.addEmployee(emp);
		
		
		
		
	}
	public List<Employee> fetchAllEmployee(){
		return employeerepository.getAllEmployees();
		
		
	}

}
