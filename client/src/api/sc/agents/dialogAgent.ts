import { ScAddr, ScTemplate, ScType } from 'ts-sc-client';
import { client } from '@api/sc/client';

const conceptDialog = 'concept_dialog';
const rrelDialogParticipant = 'rrel_dialog_participant';

const baseKeynodes = [
    { id: conceptDialog, type: ScType.NodeConstClass },
    { id: rrelDialogParticipant, type: ScType.NodeConstRole },
];

const findDialogNode = async (user: ScAddr) => {
    const keynodes = await client.resolveKeynodes(baseKeynodes);

    const dialog = '_dialog';
    const template = new ScTemplate();
    template.triple(
        keynodes[conceptDialog],
        ScType.EdgeAccessVarPosPerm,
        [ScType.NodeVar, dialog],
    );
    template.tripleWithRelation(
        dialog,
        ScType.EdgeAccessVarPosPerm,
        user,
        ScType.EdgeAccessVarPosPerm,
        keynodes[rrelDialogParticipant],
    );
    const resultDialogNode = await client.templateSearch(template);

    if (resultDialogNode.length) {
        return resultDialogNode[0].get(dialog);
    }
    return null;
};

export const dialogAgent = async (users: ScAddr[]) => {
    return await findDialogNode(users[0]);
};
