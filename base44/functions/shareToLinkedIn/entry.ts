import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, projectId } = await req.json();

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    // Get LinkedIn access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken("linkedin");

    // Get LinkedIn user ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!profileResponse.ok) {
      console.error('LinkedIn profile fetch error:', await profileResponse.text());
      return Response.json({ error: 'Failed to fetch LinkedIn profile' }, { status: 500 });
    }

    const profile = await profileResponse.json();
    const linkedInUserId = profile.sub;

    // Create post
    const postData = {
      author: `urn:li:person:${linkedInUserId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      console.error('LinkedIn post error:', errorText);
      return Response.json({ error: 'Failed to post to LinkedIn', details: errorText }, { status: 500 });
    }

    const result = await postResponse.json();

    return Response.json({ 
      success: true, 
      postId: result.id,
      message: 'Successfully shared to LinkedIn!' 
    });

  } catch (error) {
    console.error('Error sharing to LinkedIn:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});