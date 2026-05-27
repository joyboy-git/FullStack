create database payment_db;
use payment_db;
create table accounts(account_id int primary key, 
name varchar(50), balance decimal(10,2));
insert into accounts values(1,'User',1000.00);
insert into accounts values(2,'Merchant',5000.00);
select * from accounts;
update accounts set balance=500.00 where account_id=2;

-- Successfull Transaction --
Start transaction;
update accounts set balance=1000 where account_id=1;
update accounts set balance=500 where account_id=2;
commit;

-- Failed Transaction--
Start transaction;
update accounts set balance=balance-200 where account_id=1;
-- Wrong account to simulate error--
update accounts set balance=balance+200 where account_id=99;
rollback;
