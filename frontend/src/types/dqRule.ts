export type DqEntityType = 'PRACTITIONER' | 'ORGANIZATION';
export type DqRuleType = 'REQUIRED' | 'REGEX' | 'RANGE' | 'UNIQUE' | 'CUSTOM';
export type DqRuleSeverity = 'ERROR' | 'WARNING';

export interface DqRule {
  id: string;
  ruleName: string;
  entityType: DqEntityType;
  fieldName: string;
  ruleType: DqRuleType;
  ruleExpression?: string;
  severity: DqRuleSeverity;
  errorMessage: string;
  successMessage?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DqRuleFormValues {
  ruleName: string;
  entityType: DqEntityType;
  fieldName: string;
  ruleType: DqRuleType;
  ruleExpression?: string;
  severity: DqRuleSeverity;
  errorMessage: string;
  successMessage?: string;
  active?: boolean;
}
