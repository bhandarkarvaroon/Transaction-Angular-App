
app.controller("transactionController",['$scope','$timeout', 'CrudService',
    function ($scope,$timeout, CrudService) {
        
        //Base Definitions
        var baseUrl = 'http://localhost:52230/api/Transaction';
        $scope.btnText = "Save";
        $scope.buttonStyle = "btn-success";
        $scope.transactionId = 0;
        $scope.TransactionStatus = true;
        $scope.noTransactions = false;
        $scope.serverError = "";
        
        $scope.transactionTypes = [{id:0,trtype:'Subscription'},{id:1,trtype:'Redemption'}];
        $scope.transactionSubTypes = [{id:1,trtype:'New Subscription'},{id:2,trtype:'Additional Subscription'},{id:3,trtype:'Redemption'}, {id:4,trtype:'Full Redemption'}];
        
        
        CrudService.getAll("http://localhost:52230/api/Fund").then(function(response){
            $scope.Funds = response.data;
            //console.log($scope.Funds);
        });
            
        //Get All transactions
        $scope.GetTransactions = function(){
            var apiRoute = baseUrl;
            var transactions = CrudService.getAll(apiRoute);
            transactions.then(function(response){
                _.each(response.data, function(record){
                    var fund = _.filter($scope.Funds,function(item){
                        return item.FundId == record.FundId                        
                    })   
                    //console.log(fund.length);
                    fund.length > 0 ? record.FundId = fund[0].FundName : record.FundId = "No Data Found";
                });
                $scope.transactions = response.data;
            },function(error){
                $scope.noTransactions = true;
                $scope.serverError = error;
                console.log("Error:"+error);
            });
        }   
        
        $scope.GetTransactionTypeText = function(typeId){
            return $scope.transactionTypes[typeId].trtype;
        }
        
        
        $timeout(function () {
            $scope.GetTransactions();
            }, 200);
        
        
        
        //Save and Update Transaction
        $scope.SaveUpdate = function () {
            var transaction = {
                    TransactionId: $scope.TransactionId,
                    ExternalTransactionId: $scope.ExternalTransactionId,
                    TransactionType: $scope.TransactionType,
                    CashAmount: $scope.CashAmount,
                    NAV: $scope.NAV,
                    NAVDate: $scope.NAVDate,
                    FundId: $scope.FundId,
                    AccountId : $scope.AccountId,
                    TransactionStatus : $scope.TransactionStatus
                }

            
            if ($scope.btnText == "Save") {
                var apiRoute = baseUrl + '/SaveTransaction/';
                
                var saveTransaction = CrudService.post(apiRoute, transaction);
                saveTransaction.then(function (response) {
                    if (response.data != "") {
                        $scope.Clear();
                        $('#myModal').modal('hide');
                        $scope.GetTransactions();
                    } else {
                        alert("Some error");
                    }
                }, function (error) {
                    console.log("Error: " + error);
                });
            } else {
                console.log(transaction.FundId);
                var apiRoute = baseUrl + '/UpdateTransaction/';
                var updateTransaction = CrudService.put(apiRoute, transaction);
                updateTransaction.then(function (response) {
                    if (response.data != "") {
                        $scope.Clear();
                        $('#myModal').modal('hide');
                        $scope.btnText = "Save";
                        $scope.buttonStyle = "btn-success";
                        $scope.GetTransactions();
                    } else {
                        alert("Some error");
                    }
                }, function (error) {
                    console.log("Error: " + error);
                });
            }
        }
        
        $scope.GetTransactionByID = function (dataModel) {
            var apiRoute = baseUrl +'/GetTransactionById?id='+dataModel.TransactionId;
            var transaction = CrudService.getbyID(apiRoute);
            
            
            transaction.then(function (response) {
                $scope.TransactionId = response.data.TransactionId;
                $scope.ExternalTransactionId = response.data.ExternalTransactionId;
                $scope.TransactionType = response.data.TransactionType;
                $scope.CashAmount = response.data.CashAmount;
                $scope.NAV = response.data.NAV;
                $scope.NAVDate = response.data.NAVDate;
                $scope.FundId = response.data.FundId;
                $scope.AccountId = response.data.AccountId;
                $scope.TransactionStatus = response.data.TransactionStatus;
                $scope.btnText = "Update";
                $scope.buttonStyle = "btn-primary";

                console.log($scope.TransactionType);
                
                $('#myModal').modal('show');
                
            }, function (error) {
                console.log("Error: " + error);
            });
        }
        
        $scope.DeleteTransaction = function (dataModel) {
            var apiRoute = baseUrl + '/DeleteTransaction?id=' + dataModel.TransactionId;
            var deleteTransaction = CrudService.delete(apiRoute);
            deleteTransaction.then(function (response) {
                if (response.data != "") {
                    alert("Data Delete Successfully");
                    $scope.GetTransactions();
                } else {
                    alert("Some error");
                }
            }, function (error) {
                console.log("Error: " + error);
            });
        }
        
        $scope.Clear = function(){
            $scope.TransactionId = "";
            $scope.ExternalTransactionId = "";
            $scope.TransactionType = "";
            $scope.CashAmount = "";
            $scope.NAV = "";
            $scope.NAVDate = "";
            $scope.FundId = "";
            $scope.AccountId = "";
            $scope.TransactionStatus = "true";
            $scope.btnText = "Save";
            $scope.buttonStyle = "btn-success";
        }
        
        $scope.doSomethingWithDate = function (date){
              alert(date);
            };
        
        
        
    }
]);





