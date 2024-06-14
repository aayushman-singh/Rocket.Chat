import { Users } from './fixtures/userStates';
import { Moderation, HomeChannel } from './page-objects';
import { createTargetChannel, deleteChannel } from './utils';
import { test, expect } from './utils/test';

test.use({ storageState: Users.admin.state });

test.describe.serial('Message moderation', () => {
	let poModeration: Moderation;
	let poHomeChannel: HomeChannel;
	let targetChannel: string;

	test.beforeEach(async ({ page }) => {
		poHomeChannel = new HomeChannel(page);
		poModeration = new Moderation(page);

		await page.goto('/home');
	});

	test.beforeAll(async ({ api }) => {
		targetChannel = await createTargetChannel(api);
	});

	test.describe('Moderation Console', () => {
		const singleMessage = 'Message to report';

		test.beforeAll(async ({ browser }) => {
			const user1Page = await browser.newPage({ storageState: Users.user1.state });
			const user1Channel = new HomeChannel(user1Page);
			await user1Page.goto(`/channel/${targetChannel}`);
			await user1Channel.waitForChannel();
			await user1Channel.content.sendMessage(singleMessage);
			await expect(user1Channel.content.lastUserMessage).toContainText(singleMessage);

			await user1Page.close();
		});

		test.afterAll(async ({ api }) => {
			await deleteChannel(api, targetChannel);
		});

		test.describe('Message reporting', async () => {
			test('User can report a given text message', async () => {
				await poHomeChannel.sidenav.openChat(targetChannel);
				await poHomeChannel.content.openLastMessageMenu();
				await poModeration.reportMsgButton.click();
				await expect(poModeration.reportMessageModal).toBeVisible();
				await poModeration.reportMessageReasonText.fill('Reason to report');
				await poModeration.reportMessageReasonSubmit.click();
				await expect(poModeration.toastSuccess).toBeVisible();
			});

			test('Admin can see the reported messages', async ({ page }) => {
				await page.goto('/admin/moderation/messages');
				await expect(poModeration.reportedMessagesTab).toBeVisible();
				await poModeration.findRowByName(targetChannel).click();
				await expect(poModeration.findLastReportedMessage(singleMessage)).toBeVisible();
			});
		});
	});
});