import {test,expect,chromium} from '@playwright/test';

test('reading mode preserves specific project content, accessible tabs, dialogs and scope',async({page})=>{
 await page.goto('/?reading=1');await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.spatial-project')).toHaveCount(4);
 await page.getByRole('button',{name:'Explore Oculomics · Research'}).click();await expect(page.getByRole('dialog')).toContainText('not a clinically validated');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Explore Oculomics · Research'})).toBeFocused();
 const creative=page.getByRole('tab',{name:/Creative, PR & Strategy/});await creative.click();await expect(page.locator('.spatial-project')).toHaveCount(6);await expect(page.locator('.spatial-projects')).toContainText('Startup Club');
 await page.getByRole('button',{name:'Explore Studio Navya · Design & strategy'}).click();await expect(page.getByRole('dialog')).toContainText('personal studio');await page.keyboard.press('Escape');await creative.focus();await page.keyboard.press('ArrowLeft');await expect(page.getByRole('tab',{name:/Tech & Bioengineering/})).toHaveAttribute('aria-selected','true');
});

test('reduced motion avoids model requests and retains box-free content at seven widths',async({page})=>{
 let requested=false;page.on('request',r=>{if(r.url().endsWith('/models/skeleton.glb'))requested=true;});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');await expect(page.locator('canvas')).toHaveCount(0);
 for(const width of[360,390,600,768,1024,1440,1920]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`).toBe(true);}
 for(const selector of['.clean-hero','.spatial-project','.spatial-project-copy']){const styles=await page.locator(selector).first().evaluate(el=>({border:getComputedStyle(el).borderTopWidth,background:getComputedStyle(el).backgroundColor}));expect(styles).toEqual({border:'0px',background:'rgba(0, 0, 0, 0)'});}
 expect(requested).toBe(false);await expect(page.getByRole('button',{name:'System reduced motion enabled'})).toBeDisabled();
});

test('contact prepares an unsent draft and clipboard failure retains manual copying',async({page})=>{
 await page.goto('/?reading=1');await page.getByLabel('Your name',{exact:true}).fill('Test Visitor');await page.getByLabel('Your email',{exact:true}).fill('visitor@example.com');await page.getByLabel('A little context',{exact:true}).fill('A research collaboration with a clear brief and defined scope.');await page.getByRole('button',{name:'Prepare an email'}).click();await expect(page.locator('.email-preview')).toContainText('NOT SENT');
 const href=await page.getByRole('link',{name:'Open email app'}).getAttribute('href');expect(href).toMatch(/^mailto:/);expect(decodeURIComponent(href)).toContain('visitor@example.com');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('Unavailable'))}}));await page.getByRole('button',{name:'Copy message'}).click();await expect(page.locator('.email-preview').getByRole('status')).toContainText('copy it manually');
});

test('WebGL failure and no JavaScript retain portfolio content, legal links and a working demonstration download',async({browser,request})=>{
 const fallback=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-webgl']});try{const page=await fallback.newPage();await page.goto('http://127.0.0.1:3100');await expect(page.locator('.anatomy-unavailable')).toHaveCount(1);await expect(page.locator('.model-load-error')).toContainText('3D model unavailable');await page.getByRole('button',{name:'Explore Oculomics · Research'}).click();await expect(page.getByRole('dialog')).toBeVisible();}finally{await fallback.close();}
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();const response=await page.goto('http://127.0.0.1:3100');expect(response.status()).toBe(200);await expect(page.locator('.spatial-project')).toHaveCount(4);await expect(page.getByRole('heading',{level:1})).toBeVisible();await expect(page.getByRole('link',{name:'Privacy Policy (draft)',exact:true})).toHaveAttribute('href','/privacy');await context.close();
 const demo=await request.get('/studies/analysis_pipeline.py');expect(demo.status()).toBe(200);expect(await demo.text()).toContain('SYNTHETIC DEMONSTRATION');
});

test('anatomical chapter actions retain project mappings and normal anchor navigation',async({page})=>{
 await page.goto('/?reading=1');await page.getByRole('link',{name:'Connection',exact:true}).click();await expect(page.locator('#spine')).toBeInViewport();await page.getByRole('button',{name:'View operational leadership',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('AWS Student Builder operational lead');
});
