import {test,expect} from '@playwright/test';
test('legal pages are linked drafts describing actual browser-only data practices',async({page})=>{
 await page.goto('/?reading=1');await page.getByRole('link',{name:'Privacy Policy (draft)',exact:true}).click();await expect(page.getByRole('heading',{name:'Privacy Policy',exact:true})).toBeVisible();await expect(page.locator('.legal-draft')).toContainText('Draft');await expect(page.locator('main')).toContainText('does not send its contents to a server');await expect(page.locator('main')).toContainText('retention practices have not been confirmed');
 await page.getByRole('link',{name:'Terms of Service (draft)',exact:true}).click();await expect(page.getByRole('heading',{name:'Terms of Service',exact:true})).toBeVisible();await expect(page.locator('main')).toContainText('No jurisdiction, refund policy');
});
