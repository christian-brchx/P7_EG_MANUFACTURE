public with sharing class APXOptSearchOnAccountPage {
    public APXOptSearchOnAccountPage() {
    }
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String accountId, String keyword) {
        // List<Opportunity> opportunities;
        System.debug('getOpportunities : keyword = '+keyword);     
        System.debug('getOpportunities : accountId = '+accountId);
        String acctId = accountId;     
        String searchquery='select Id,Name,StageName,Amount, CloseDate from Opportunity where Name like \'%'+keyWord+'%\' and AccountId = :acctId';
        System.debug('search query obtained '+searchquery);  
        return Database.query(searchquery);
        // return [select Id,Name,StageName,Amount, CloseDate from Opportunity where Name like \'%'+keyWord+'%\' and AccountId = :acctId];
        //Opportunities = [SELECT Name,id,StageName,CloseDate,Amount FROM Opportunity WHERE name LIKE %:keyWord% AND AccountId = :accountId ]
        //return opportunities;
    }

}
